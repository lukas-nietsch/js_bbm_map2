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

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // SET START VARIABLES, BASIC FUNCTIONS, STYLE OPTIONS
    // Path variables
    var path_prefix = './data/';

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
        if (r0Value < 0.8) return '#e1f3f8';
        if (r0Value < 1.0) return '#92bfdb';
        if (r0Value < 1.5) return '#fddf90';
        return '#d73127'
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // DATA IMPORT AND PROCESSING SECTION
    // Function to load CSV
    async function loadCSV(year) {
        try {
            const csvData = await d3.csv(`${path_prefix}R0_mn/R0_${year}.csv`);
//            console.log('CSV Read in: ', csvData);
            return csvData;
        } catch (error) {
//            console.error('Error loading CSV data: ', error);
            alert('Failed to load data for the selected year.');
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
                feature.properties.r0Value = csvLookup[id][`mn_${dayOfYear}`] || 'No data available';
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
        const geojsonID = 'ID_3';
        const csvID = 'ID_3';
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
                    fillOpacity: 0.4,
                    color: 'black',
                    weight: 0.5
                };
            }
        });
    }

    // Function to populate the "Kreis" dropdown menu
    function populateKreisDropdown(geojsonData){
        const dropdown = document.getElementById('kreis-dropdown');
        // Sort the features alphabetically by NAME_3
        geojsonData.features.sort((a, b) => a.properties.NAME_3.localeCompare(b.properties.NAME_3));
        geojsonData.features.forEach(feature => {
            const option = document.createElement('option');
            option.value = feature.properties.ID_3;
            option.text = feature.properties.NAME_3;
            dropdown.add(option);
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // ADD RASTER LAYERS AS PNG OVERLAYS - NOTE: All files must have the exact same Extent!
    // Extents of the Germany Raster: 
    var ext_ger = [[47.25, 5.75], [55.00, 15.00]];

    var imgLayer;

    // Function to update the image overlay based on the selected date
    function updateImage(date) {
        var selectedDay = getDayOfYear(date);
        var imgPath = `${path_prefix}png/colored_img_${selectedDay}.png`;

        if (imgLayer) {
            map.removeLayer(imgLayer);
        }

        imgLayer = L.imageOverlay(imgPath, ext_ger, { opacity: 0.8 }).addTo(map);

        const isChecked = document.getElementById('SwitchRasterVektor').checked;
        if (isChecked == true) {
            map.removeLayer(imgLayer);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // INTITIALIZE MAP CONTENTS
    // Load GeoJSON data
    $.getJSON(`${path_prefix}kreise.geojson`, function (geojsonData) {
        geojsonLayer = L.geoJson(geojsonData, {
            onEachFeature: function (feature, layer) {
                layer.on('click', function () {
                    if (feature.properties.r0Value) {
                        layer.bindPopup('R0 Mittelwert: ' + 
                            parseFloat(feature.properties.r0Value).toFixed(2) + '<br>' +
                            'Landkreis: ' + feature.properties.NAME_3).openPopup();
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
                if (row['ID_3'] === kreisId) {
                    // Loop through each day in the defined range
                    for (let day = startDay; day <= endDay; day++) {
                        let date = new Date(year, 0, day);
                        date.setDate(date.getDate() + 1);
                        let r0Value = parseFloat(row[`mn_${day}`]);
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
    async function resetChart(){
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
            alert("Please select a valid date range.");
        }
    };

    // Function to update the chart when a kreis or date is selected
    async function updateChart() {
        let startDate = new Date(document.getElementById('start-datepicker').value);
        let endDate = new Date(document.getElementById('end-datepicker').value);
        let kreisDropdown = document.getElementById('kreis-dropdown');
        let kreisId = kreisDropdown.value;
        let kreisLabel = kreisDropdown.options[kreisDropdown.selectedIndex].text;

        // Check if valid date range and kreis is selected
        if (startDate <= endDate && kreisId) {
            const r0Data = await getR0ValuesForRange(startDate, endDate, kreisId);

            // if no chart exists render one, if one exists create new one
            if (!chart) {
                renderChart(r0Data, kreisLabel);
            } else {
                // Check if the kreis is already displayed in chart
                const existingDatasetIndex = chart.data.datasets.findIndex(
                    dataset => dataset.label === kreisLabel
                );

                if (existingDatasetIndex === -1) {
                    // If the kreis is not in chart, add as a new dataset
                    chart.data.labels = r0Data.map(d => d.date);
                    chart.data.datasets.push({
                        label: kreisLabel,
                        data: r0Data.map(d => d.r0Value),
                        borderColor: getRandomColor(),
                        borderWidth: 1,
                        fill: false,
                        pointStyle: false,
                    });
                    chart.update();    
                } 
            } 
        } /* else {
                alert("Please select a valid date range and kreis");
            } */
    };

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
            }
        });
    };
   
    document.getElementById('end-datepicker').addEventListener('change', resetChart);
    document.getElementById('start-datepicker').addEventListener('change', resetChart);
    document.getElementById('kreis-dropdown').addEventListener('change', updateChart);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // INITIALIZE START DATE AND SET EVENT LISTENERS
    // Set default date to today
    var today = new Date().toISOString().split('T')[0];
    var t = new Date();
    var lastWeek = t.getDate()-7;
    var lastWeeksDay = new Date(t.setDate(lastWeek)).toISOString().split('T')[0];

    document.getElementById('datepicker-mean').value = today;
    document.getElementById('start-datepicker').value = lastWeeksDay;
    document.getElementById('end-datepicker').value = today;

    // Update map when date changes
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
