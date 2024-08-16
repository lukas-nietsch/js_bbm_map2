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

    // Function to load CSV
    async function loadCSV(year) {
        try {
            const csvData = await d3.csv(`/data/R0_mn/R0_${year}.csv`);
            console.log('CSV Read in: ', csvData);
            return csvData;
        } catch (error) {
            console.error('Error loading CSV data: ', error);
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
    }

    // Add Raster Images as png ImageOverlay - NOTE: All files must have the exact same Extent!
    // Extents of the Germany Raster: 
    var ext_ger = [[47.25, 5.75], [55.00, 15.00]];

    var imgLayer;

    // Function to update the image overlay based on the selected date
    function updateImage(date) {
        var selectedDay = getDayOfYear(date);
        var imgPath = `/data/png/colored_img_${selectedDay}.png`;

        if (imgLayer) {
            map.removeLayer(imgLayer);
        }

        imgLayer = L.imageOverlay(imgPath, ext_ger, { opacity: 0.8 }).addTo(map);
    }

    // Define geojsonLayer globally
    var geojsonLayer;

    // Load GeoJSON data
    $.getJSON('/data/kreise.geojson', function (geojsonData) {
        geojsonLayer = L.geoJson(geojsonData, {
            onEachFeature: function (feature, layer) {
                layer.on('click', function () {
                    var date = new Date(document.getElementById('datepicker-mean').value);
                    var year = date.getFullYear();
                    var dayOfYear = getDayOfYear(date);
                    var kreisId = feature.properties.ID_3; // Assuming each feature has an 'ID_3' property

                    if (feature.properties.r0Value) {
                        layer.bindPopup('R0 Mean Value: ' + 
                            parseFloat(feature.properties.r0Value).toFixed(2) + '<br>' +
                            'Landkreis: ' + feature.properties.NAME_3).openPopup();
                        // layer.bindPopup('Landkreis: ' + feature.properties.NAME_3).openPopup();
                    } else {
                        layer.bindPopup('No data available').openPopup();
                    }
                });
            },
            style: {
                fillColor: 'white',
                color: 'black',
                weight: 0.5
            }
        }).addTo(map);

        // Initial load of R0 values for the current year and day of the year
        var today = new Date().toISOString().split('T')[0];
        var initialDate = new Date(today);
        var initialYear = initialDate.getFullYear();
        var initialDayOfYear = getDayOfYear(initialDate);
        updateR0Values(initialYear, initialDayOfYear, geojsonLayer);
        updateImage(initialDate);
    });

    // CHART FUNCTIONS
        // HIER WEITER!!! - Werte müssen richtig übergeben werden -> gibt keinen Wert für Deutschland,
        // nur für Kreise. Also entweder aggregieren (dann Kreisangabe nötig!!) oder direkt Mittelwert aus
        // allen Werten erzeugen!!

        // Function to get R0 values between start and end date
        async function getR0ValuesForRange(startDate, endDate) {
            let currentYear = startDate.getFullYear();
            let endYear = endDate.getFullYear();
            let startdoy = getDayOfYear(startDate);
            let enddoy = getDayOfYear(endDate);
            let r0Data = [];
    
            
            while (currentYear <= endYear) {
                let csvData = await loadCSV(currentYear);
                console.log(`CSV Data for year ${currentYear}: `, csvData);

                csvData.forEach(row => {
                    let dayOfYear = parseInt(row['day_of_year']);
                    let date = new Date(currentYear, 0, dayOfYear);

                    console.log(`Parsed Date: ${date}, Start date: ${startDate}, End date: ${endDate}`);

                    if (date >= startDate && date <= endDate) {
                        let r0Value = parseFloat(row['mn_${dayOfYear}']);
                        console.log(`R0 Value for date ${date.toISOString().split('T')[0]}: ${r0Value}`); // Debug log
                        
                        r0Data.push({
                            date: date.toISOString().split('T')[0],  // Format the date as YYYY-MM-DD
                            r0Value: r0Value.toFixed(2) || 'No data available'
                        });
                    }
                });
                currentYear++;
            }
            
            console.log('R0 Data for range: ', r0Data);
            return r0Data;
        }
    
        // Function to render the chart
        function renderChart(r0Data) {
            const ctx = document.getElementById('r0Chart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: r0Data.map(d => d.date),
                    datasets: [{
                        label: 'R0 Mean Value',
                        data: r0Data.map(d => d.r0Value),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                displayFormats: {
                                    day: 'MMM D'
                                }
                            },
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'R0 Mean Value'
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    
        // Function to update the chart when dates are selected
        document.getElementById('end-datepicker').addEventListener('change', async function () {
            let startDate = new Date(document.getElementById('start-datepicker').value);
            let endDate = new Date(this.value);
    
            if (startDate <= endDate) {
                const r0Data = await getR0ValuesForRange(startDate, endDate);
                renderChart(r0Data);
            } else {
                alert("End date must be after start date.");
            }
        });
    
        document.getElementById('start-datepicker').addEventListener('change', async function () {
            let startDate = new Date(this.value);
            let endDate = new Date(document.getElementById('end-datepicker').value);
    
            if (startDate <= endDate) {
                const r0Data = await getR0ValuesForRange(startDate, endDate);
                renderChart(r0Data);
            } else {
                alert("Start date must be before end date.");
            }
        });

    // INITIALIZING
    // Set default date to today
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('datepicker-mean').value = today;

    // Update map when date changes
    document.getElementById('datepicker-mean').addEventListener('change', function () {
        var date = new Date(this.value);
        var year = date.getFullYear();
        var dayOfYear = getDayOfYear(date);

        updateR0Values(year, dayOfYear, geojsonLayer);
        updateImage(date);
    });
});
