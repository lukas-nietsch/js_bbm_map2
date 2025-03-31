document.addEventListener('DOMContentLoaded', function () {
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // INITIALIZE MAP
    var map = L.map('map').setView([51.1657, 10.4515], 6);
    // Add Basemaps tile layer
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
       	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Add Layer Control
    var baseMaps = {
        "OpenStreetMap Graustufe": carto,
        "OpenStreetMap": osm
    };
    L.control.layers(baseMaps).addTo(map);

    // Add Legend png
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML = '<img src="./img/legend.png" alt="Legende" width="200" height=auto>';
        return div;
    };

    legend.addTo(map);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // SET START VARIABLES, BASIC FUNCTIONS, STYLE OPTIONS
    // Path variables
    var path_prefix = '../data/';
    var png_path_prefix = '../data/png/';

    // Get the day of the year
    function getDayOfYear(date) {
        var start = new Date(date.getFullYear(), 0, 0);
        var diff = date - start;
        var oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }
    
    // GEOJSON DEFINITION AND STYLE FUNCTIONS
    // Define GeoJSON variable globally
    var geojsonLayer;

    // Set Default Style for GeoJSON Layer
    var defaultStyle = {
        fillColor: 'white',
        color: 'black',
        weight: 0.5
    }
    // Style function for GeoJSON Layer
    function getColor(r0Value) {
        if (isNaN(r0Value)) return 'gray';
        if (r0Value < 0.8) return '#FFFFFF';
        if (r0Value < 1.0) return '#92bfdb';
        if (r0Value < 1.5) return '#fddf90';
        return '#d73127'
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // DATA IMPORT AND PROCESSING SECTION
    // Function to load CSV
    async function loadCSV(year) {
        try {
            const csvData = await d3.csv(`${path_prefix}R0_mn/WNV_RISK_${year}.csv`);
//            console.log('CSV Read in: ', csvData);
            return csvData;
        } catch (error) {
            console.error('Error loading CSV data: ', error);
            alert('Failed to load data for the selected year. Currently the platform is filled with data from 2017 to now.');
            return [];
        }
    }

    // Function to bind the CSV data to the GeoJSON Layer
    function bindDataToGeoJSON(csvData, geojsonData, geojsonID, csvID, dayOfYear) {
        const csvLookup = {};

        csvData.forEach(row => {
            csvLookup[row[csvID]] = row;
        });

        geojsonData.features.forEach(feature => {
            const id = feature.properties[geojsonID];
            if (csvLookup[id]) {
                // Attach the R0 value to the feature's properties
                feature.properties.r0Value = csvLookup[id][`mean.day_${dayOfYear}`] || 'No data available';
            } else {
                feature.properties.r0Value = 'No data available';
            }
        });

        return geojsonData;
    }

    // Function to update R0 values
    async function updateR0Values(year, dayOfYear, geojsonLayer) {
        // Load the CSV Data
        const csvData = await loadCSV(year);
        // Specify the field names used as a common ID
        const geojsonID = 'ID';
        const csvID = 'ID';
        // Bind the data
        const updatedGeoJSON = bindDataToGeoJSON(csvData, geojsonLayer.toGeoJSON(), geojsonID, csvID, dayOfYear);

        // Update the map layer with the new data
        geojsonLayer.clearLayers();
        geojsonLayer.addData(updatedGeoJSON);

        // Update the geojsonLayer Styling
        const isChecked = document.getElementById('SwitchRasterVektor').checked;
        geojsonLayer.setStyle(function(feature) {
            if (!isChecked) {
                return defaultStyle;
            } else {
                const r0Value = parseFloat(feature.properties.r0Value);
                return {
                    fillColor: getColor(r0Value),
                    fillOpacity: 0.8,
                    color: 'black',
                    weight: 0.5
                };
            }
        });
    }

    // Function to populate the "Kreis" dropdown menu
    function populateKreisDropdown(geojsonData){
        const dropdown = document.getElementById('kreis-dropdown');
        // Sort the features alphabetically by GeografischerName_GEN
        geojsonData.features.sort((a, b) => a.properties.GeografischerName_GEN.localeCompare(b.properties.GeografischerName_GEN));
        geojsonData.features.forEach(feature => {
            const option = document.createElement('option');
            option.value = feature.properties.ID;
            var label = feature.properties.GeografischerName_GEN + ' (' + feature.properties.Bezeichnung + ')';
            option.text = label;
            dropdown.add(option);
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // ADD RASTER LAYERS AS PNG OVERLAYS - NOTE: All files must have the exact same Extent!
    // Extents of the Germany Raster: 
    var ext_ger = [[47.2909977822746441, 5.8504582477843972], [55.0188792526543011, 15.0160851080021249]]
    
    var imgLayer;

    // Function to update the image overlay based on the selected date
    function updateImage(date) {
        var selectedDay = getDayOfYear(date);
        var selectedYear = date.getFullYear();
        var imgPath = `${png_path_prefix}R0_${selectedDay}_${selectedYear}.png`;
        var noDataImgPath = `${png_path_prefix}noData.png`;

        var img = new Image();
        img.onload = function () {
            if (imgLayer) {
                map.removeLayer(imgLayer);
            }
            imgLayer = L.imageOverlay(imgPath, ext_ger, { opacity: 0.8 }).addTo(map);

            const isChecked = document.getElementById('SwitchRasterVektor').checked;
            if (isChecked == true) {
                map.removeLayer(imgLayer);
            }
        };
        
        img.onerror = function () {
            if (imgLayer) {
                map.removeLayer(imgLayer);
            }
            imgLayer = L.imageOverlay(noDataImgPath, ext_ger).addTo(map);
            
            const isChecked = document.getElementById('SwitchRasterVektor').checked;
            if (isChecked == true) {
                map.removeLayer(imgLayer);
            }
        };

        img.src = imgPath;
    };


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // INTITIALIZE MAP CONTENTS
    // Load GeoJSON data
    $.getJSON(`${path_prefix}DE_Kreise.geojson`, function (geojsonData) {
        geojsonLayer = L.geoJson(geojsonData, {
            onEachFeature: function (feature, layer) {
                layer.on('click', function () {
                    if (feature.properties.r0Value) {
                        layer.bindPopup('R0 Mittelwert: ' + 
                            parseFloat(feature.properties.r0Value).toFixed(2) + '<br>' +
                            feature.properties.Bezeichnung + ' ' + feature.properties.GeografischerName_GEN).openPopup();
                    } else {
                        layer.bindPopup('Keine Daten vorhanden').openPopup();
                    }
                });
            },
            style: defaultStyle
        }).addTo(map);

        populateKreisDropdown(geojsonData);

        // Initial load of R0 values for the current year and day of the year
        var initialDate = new Date(new Date().toISOString().split('T')[0]);
        var initialYear = initialDate.getFullYear();
        var initialDayOfYear = getDayOfYear(initialDate);
        updateR0Values(initialYear, initialDayOfYear, geojsonLayer);
        updateImage(initialDate);
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // CHART FUNCTIONS
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Function to get R0 values between start and end date
    async function getR0ValuesForRange(startDate, endDate, kreisId) {
        let startYear = startDate.getFullYear();
        let endYear = endDate.getFullYear();
        let r0Data = [];
        // Loop through each year in the range, necessary when a date range spans over multiple years
        for (let year = startYear; year <= endYear; year++) {
            // Load the CSV data for the current year
            let csvData = await loadCSV(year);
            //console.log(`CSV Data for year ${year}: `, csvData);
    
            // Define the start and end day of the year for the current year
            let startDay = (year === startYear) ? getDayOfYear(startDate) : 1;
            let endDay = (year === endYear) ? getDayOfYear(endDate) : 365;
    
            // Loop through each row in the CSV data
            csvData.forEach(row => {
                if (row['ID'] === kreisId) {
                    // Loop through each day in the defined range
                    for (let day = startDay; day <= endDay; day++) {
                        let date = new Date(year, 0, day);
                        date.setDate(date.getDate() + 1);
                        let r0Value = parseFloat(row[`mean.day_${day}`]);
                        //console.log(`R0 Value for date ${date.toISOString().split('T')[0]}: ${r0Value}`); // Debug log
    
                        r0Data.push({
                            date: date.toISOString().split('T')[0], // Format the date as YYYY-MM-DD
                            r0Value: isNaN(r0Value) ? 'No data available' : r0Value.toFixed(2)
                        });
                    }
                }
            });
        }
        //console.log('R0 Data for range: ', r0Data);
        return r0Data;
    };

    // Declare variables needed for chart generation
    var chart;

    // Reset chart function when start or end date is changed
/*     async function resetChart(){
        let startDate = new Date(document.getElementById('start-datepicker').value);
        let endDate = new Date(document.getElementById('end-datepicker').value);

        if (startDate <= endDate) {
            // Reset the chart data and labels
            if (chart) {
                chart.data.labels = [];
                chart.data.datasets = [];
                chart.update();
            }
            // Update chart with new date range but no data
            updateChart();
        } else {
            alert("Please select a valid date range. Ensure that the selected Start Date is before the End Date.");
        }
    }; */

    async function resetChart() {
        let startDate = new Date(document.getElementById('start-datepicker').value);
        let endDate = new Date(document.getElementById('end-datepicker').value);
    
        if (startDate <= endDate) {
            // Reset the chart data and labels
            if (chart) {
                chart.destroy(); // Destroy the existing chart to avoid conflicts
                chart = null; // Reset the chart variable
            }
            // Update chart with new date range
            await updateChart();
        } /* else {
            alert("Please select a valid date range. Ensure that the selected Start Date is before the End Date.");
        } */
    };


    async function updateChart() {
        let startDate = new Date(document.getElementById('start-datepicker').value);
        let endDate = new Date(document.getElementById('end-datepicker').value);
        let kreisDropdown = document.getElementById('kreis-dropdown');
        let kreisId = kreisDropdown.value;
        let kreisLabel = kreisDropdown.options[kreisDropdown.selectedIndex].text;
    
        if (startDate <= endDate) {
            if (!chart) {
                // If no chart exists, create it with the selected kreis
                const r0Data = await getR0ValuesForRange(startDate, endDate, kreisId);
                renderChart(r0Data, kreisLabel);
            } else {
                // Store all kreise currently in the chart
                let existingKreise = chart.data.datasets.map(dataset => dataset.label);
    
                // Fetch updated R0Data for all displayed kreise
                let updatedData = {};
                for (let label of existingKreise) {
                    let kreisOption = [...kreisDropdown.options].find(option => option.text === label);
                    if (kreisOption) {
                        let kreisData = await getR0ValuesForRange(startDate, endDate, kreisOption.value);
                        updatedData[label] = kreisData;
                    }
                }
    
                // Update each dataset with the new data
                chart.data.datasets.forEach(dataset => {
                    if (updatedData[dataset.label]) {
                        dataset.data = updatedData[dataset.label].map(d => d.r0Value);
                    }
                });
    
                // Update chart labels based on the latest data
                if (Object.values(updatedData).length > 0) {
                    chart.data.labels = Object.values(updatedData)[0].map(d => d.date);
                }
    
                // If a new kreis is selected and not in the chart, add it
                if (!existingKreise.includes(kreisLabel)) {
                    const newR0Data = await getR0ValuesForRange(startDate, endDate, kreisId);
                    chart.data.datasets.push({
                        label: kreisLabel,
                        data: newR0Data.map(d => d.r0Value),
                        borderColor: getRandomColor(),
                        borderWidth: 1,
                        fill: false,
                        pointStyle: false,
                    });
                }
    
                chart.update();
            }
        } else {
            alert("Please select a valid date range.");
        }
    };


    // Function to update the chart when a kreis or date is selected
/*     async function updateChart() {
        let startDate = new Date(document.getElementById('start-datepicker').value);
        let endDate = new Date(document.getElementById('end-datepicker').value);
        let kreisDropdown = document.getElementById('kreis-dropdown');
        let kreisId = kreisDropdown.value;
        let kreisLabel = kreisDropdown.options[kreisDropdown.selectedIndex].text;
    
        // Check if valid date range and kreis is selected
        if (startDate <= endDate && kreisId) {
            const r0Data = await getR0ValuesForRange(startDate, endDate, kreisId);
    
            // If no chart exists, render a new one
            if (!chart) {
                renderChart(r0Data, kreisLabel);
            } else {
                // Check if the kreis is already displayed in the chart
                const existingDatasetIndex = chart.data.datasets.findIndex(
                    dataset => dataset.label === kreisLabel
                );
    
                if (existingDatasetIndex === -1) {
                    // If the kreis is not in the chart, add it as a new dataset
                    chart.data.datasets.push({
                        label: kreisLabel,
                        data: r0Data.map(d => d.r0Value),
                        borderColor: getRandomColor(),
                        borderWidth: 1,
                        fill: false,
                        pointStyle: false,
                    });
                } else {
                    // If the kreis is already in the chart, update its data
                    chart.data.datasets[existingDatasetIndex].data = r0Data.map(d => d.r0Value);
                    chart.data.labels = r0Data.map(d => d.date); // Update labels for all datasets
                }
    
                chart.update(); // Update the chart to reflect changes
            }
        } else {
            alert("Please select a valid date range and kreis.");
        }
    }; */

    // Function to render the chart
    function renderChart(r0Data, kreisLabel) {
        const ctx = document.getElementById('r0Chart').getContext('2d');

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: r0Data.map(d => d.date),
                datasets: [{
                    label: kreisLabel,
                    data: r0Data.map(d => d.r0Value),
                    borderColor: getRandomColor(),
                    borderWidth: 1,
                    fill: false,
                    pointStyle: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
            }
        });
    };
   
    document.getElementById('end-datepicker').addEventListener('change', resetChart);
    document.getElementById('start-datepicker').addEventListener('change', resetChart);
    document.getElementById('kreis-dropdown').addEventListener('change', updateChart);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // INITIALIZE START DATE AND SET EVENT LISTENERS
    // Get default and max dates and set them in the datepickers
    var today = new Date().toISOString().split('T')[0];
    var lastWeeksDay = new Date(new Date().setDate(new Date().getDate()-7)).toISOString().split('T')[0];
    var nextMonthsDay = new Date(new Date().setDate(new Date().getDate()+30)).toISOString().split('T')[0];

    // Function for adjusting dates in the datepickers
    function adjustDateMean(datePickerId, adjustment, updateR0Values, updateImage) {
        var datePicker = document.getElementById(datePickerId);
        var currentDate = new Date(datePicker.value);
        currentDate.setDate(currentDate.getDate() + adjustment);
        var newDate = currentDate.toISOString().split('T')[0];

        var minDate = new Date(datePicker.getAttribute('min'));
        var maxDate = new Date(datePicker.getAttribute('max'));

        if (currentDate >= minDate && currentDate <= maxDate) {
            datePicker.value = newDate;
            var date = new Date(newDate);
            var year = date.getFullYear();
            var dayOfYear = getDayOfYear(date);
            updateR0Values(year, dayOfYear, geojsonLayer);
            updateImage(date);
        }
    };

    function adjustDateChart(datePickerId, adjustment, updateChart) {
        var datePicker = document.getElementById(datePickerId);
        var currentDate = new Date(datePicker.value);
        currentDate.setDate(currentDate.getDate() + adjustment);
        var newDate = currentDate.toISOString().split('T')[0];

        var minDate = new Date(datePicker.getAttribute('min'));
        var maxDate = new Date(datePicker.getAttribute('max'));
        
        if (currentDate >= minDate && currentDate <= maxDate) {
            datePicker.value = newDate;
            updateChart();
        }
    };

    document.getElementById('datepicker-mean').setAttribute('max', nextMonthsDay);
    document.getElementById('start-datepicker').setAttribute('max', nextMonthsDay);
    document.getElementById('end-datepicker').setAttribute('max', nextMonthsDay);
    document.getElementById('datepicker-mean').value = today;
    document.getElementById('start-datepicker').value = lastWeeksDay;
    document.getElementById('end-datepicker').value = today;

    // Update map when dates change -- Event Listeners
    document.getElementById('datepicker-mean-arrow-left').addEventListener('click', function () {
        adjustDateMean('datepicker-mean', -1, updateR0Values, updateImage);
    });
    document.getElementById('datepicker-mean-arrow-right').addEventListener('click', function () {
        adjustDateMean('datepicker-mean', 1, updateR0Values, updateImage);
    });

    document.getElementById('datepicker-start-arrow-left').addEventListener('click', function () { 
        adjustDateChart('start-datepicker', -1, updateChart);
    });
    document.getElementById('datepicker-start-arrow-right').addEventListener('click', function () { 
        adjustDateChart('start-datepicker', 1, updateChart);
    });
    document.getElementById('datepicker-end-arrow-left').addEventListener('click', function () { 
        adjustDateChart('end-datepicker', -1, updateChart);
    });
    document.getElementById('datepicker-end-arrow-right').addEventListener('click', function () { 
        adjustDateChart('end-datepicker', 1, updateChart);
    });

    document.getElementById('datepicker-mean').addEventListener('change', function () {
        var date = new Date(this.value);
        var year = date.getFullYear();
        var dayOfYear = getDayOfYear(date);
        updateR0Values(year, dayOfYear, geojsonLayer);
        updateImage(date);
    });

    document.getElementById('SwitchRasterVektor').addEventListener('change', function () {
        var date = new Date(document.getElementById('datepicker-mean').value);
        var year = date.getFullYear();
        var dayOfYear = getDayOfYear(date);
        updateR0Values(year, dayOfYear, geojsonLayer);
        updateImage(date);
    });
});
