document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map
    var map = L.map('map').setView([51.1657, 10.4515], 6); // Centered on Germany

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Function to get the day of the year
    function getDayOfYear(date) {
        var start = new Date(date.getFullYear(), 0, 0);
        var diff = date - start;
        var oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    // Switch to locale or github content file paths
    var path_prefix = 'https://raw.githubusercontent.com/lukas-nietsch/js_bbm_map2/v1.01/data/';
    //var csv_path_prefix = 'https://cloud.biogeo.uni-bayreuth.de/index.php/s/I1KTKmRnvq0377z/download?path=/R0_mn&files='
    //var path_prefix = '/data/';

    // Function to load CSV
    async function loadCSV(year) {
        try {
            const csvData = await d3.csv(`${path_prefix}R0_mn/R0_${year}.csv`);
//            const csvData = await d3.csv(`${csv_path_prefix}R0_${year}.csv`);
//            console.log('CSV Read in: ', csvData);
            return csvData;
        } catch (error) {
//            console.error('Error loading CSV data: ', error);
            alert('Failed to load R0 data for the selected year.');
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

    // Set Default Style for Kreis geojsonLayer
    const defaultStyle = {
        fillColor: 'white',
        color: 'black',
        weight: 0.5
    }

    function getColor(r0Value) {
        if (r0Value < 0.8) return '#e1f3f8';
        if (r0Value < 1.0) return '#92bfdb';
        if (r0Value < 1.5) return '#fddf90';
        return '#d73127'
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
        // Styling- functions for geojsonLayer
        var vektorStyle = {
            fillColor: 'black',
            color: 'yellow',
            weight: 0.5
        }
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

    // Add Raster Images as png ImageOverlay - NOTE: All files must have the exact same Extent!
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

    // Define geojsonLayer globally
    var geojsonLayer;

    // Load GeoJSON data
    $.getJSON(`${path_prefix}kreise.geojson`, function (geojsonData) {
        geojsonLayer = L.geoJson(geojsonData, {
            onEachFeature: function (feature, layer) {
                layer.on('click', function () {
                    if (feature.properties.r0Value) {
                        layer.bindPopup('R0 Mean Value: ' + 
                            parseFloat(feature.properties.r0Value).toFixed(2) + '<br>' +
                            'Landkreis: ' + feature.properties.NAME_3).openPopup();
                    } else {
                        layer.bindPopup('No data available').openPopup();
                    }
                });
            },
            style: defaultStyle 
            /* {
                fillColor: 'white',
                color: 'black',
                weight: 0.5
            } */
        }).addTo(map);

        populateKreisDropdown(geojsonData);

        // Initial load of R0 values for the current year and day of the year
        var initialDate = new Date(new Date().toISOString().split('T')[0]);
        var initialYear = initialDate.getFullYear();
        var initialDayOfYear = getDayOfYear(initialDate);
        updateR0Values(initialYear, initialDayOfYear, geojsonLayer);
        updateImage(initialDate);

    });


    
    // CHART FUNCTIONS
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
    }

    // Declare variables needed for chart generation
    let chart;

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
    }
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
    }

    // Function to render the chart
    function renderChart(r0Data, kreisLabel) {
        const ctx = document.getElementById('r0Chart').getContext('2d');
        
/*         const thresholdLinePlugin = {
            id: 'thresholdLinePlugin',
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const yThreshold = 1; // Define the threshold value for y
                const yScale = chart.scales['y']; // Get the y-axis scale
        
                // Calculate the pixel position for the threshold
                const yPosition = yScale.getPixelForValue(yThreshold);
        
                // Customize line appearance
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(chart.chartArea.left, yPosition);
                ctx.lineTo(chart.chartArea.right, yPosition);
                ctx.lineWidth = 0.5; // Set the thickness of the line
                ctx.strokeStyle = 'black'; // Set the color of the line
                ctx.stroke();
                ctx.restore();
            }
        }; */

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
            }/* ,
            options: {
                plugins: {
                    thresholdLinePlugin: true
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'grey'
                        }
                    }
                }
            },
            plugins: [thresholdLinePlugin] */
        });
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    document.getElementById('end-datepicker').addEventListener('change', resetChart);
    document.getElementById('start-datepicker').addEventListener('change', resetChart);
    document.getElementById('kreis-dropdown').addEventListener('change', updateChart);
 
    // INITIALIZING
    // Set default date to today
    var today = new Date().toISOString().split('T')[0];
    var t = new Date();
    var lastWeek = t.getDate()-7;
    var lastWeeksDay = new Date(t.setDate(lastWeek)).toISOString().split('T')[0];
//    console.log('today: ', today);
//    console.log('last Weeks Day: ', lastWeeksDay);
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
