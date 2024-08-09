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
        var day = Math.floor(diff / oneDay);
        return day;
    }

    // Function to update R0 values
    function updateR0Values(year, dayOfYear) {
        var csvFilePath = `/data/R0_mn/R0_${year}.csv`;

        // Fetch the CSV data for the selected year
        $.get(csvFilePath, function (csvData) {
            var rows = csvData.split('\n');
            var r0Values = {};

            // Parse the CSV data
            for (var i = 1; i < rows.length; i++) {
                var columns = rows[i].split(',');
                var kreisId = columns[3]; // ID_3 is the 4th column (index 3)
                var r0Value = columns[4 + dayOfYear]; // mn_1 starts from the 5th column (index 4)
                r0Values[kreisId] = r0Value;
            }

            // Update the popups with the new R0 values
            geojsonLayer.eachLayer(function (layer) {
                var kreisId = layer.feature.properties.ID_3;
                var r0Value = r0Values[kreisId];

                if (r0Value !== undefined) {
                    layer.bindPopup('R0 Mean Value: ' + r0Value);
                } else {
                    layer.bindPopup('No data available');
                }
            });
        });
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

                    // Fetch the CSV data for the selected year
                    var csvFilePath = `/data/R0_mn/R0_${year}.csv`;
                    $.get(csvFilePath, function (csvData) {
                        var rows = csvData.split('\n');
                        var r0Value = null;

                        // Find the R0 value for the clicked kreis
                        for (var i = 1; i < rows.length; i++) {
                            var columns = rows[i].split(',');
                            if (columns[3] == kreisId) { // ID_3 is the 4th column (index 3)
                                r0Value = columns[4 + dayOfYear]; // mn_1 starts from the 5th column (index 4)
                                break;
                            }
                        }

                        // Show the popup with the R0 value
                        if (r0Value !== null) {
                            layer.bindPopup('R0 Mean Value: ' + r0Value).openPopup();
                        } else {
                            layer.bindPopup('No data available').openPopup();
                        }
                    });
                });
            },
            style: {
                fill: 'white',
                color: 'black',
                weight: 0.5
            }
        }).addTo(map);

        // Initial load of R0 values for the current year and day of the year
        var today = new Date().toISOString().split('T')[0];
        var initialDate = new Date(today);
        var initialYear = initialDate.getFullYear();
        var initialDayOfYear = getDayOfYear(initialDate);
        updateR0Values(initialYear, initialDayOfYear);
    });

    // Set default date to today
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('datepicker-mean').value = today;

    // Get the current year
    var currentYear = new Date(today).getFullYear();

    // Update map when date changes
    document.getElementById('datepicker-mean').addEventListener('change', function () {
        var date = new Date(this.value);
        var year = date.getFullYear();
        var dayOfYear = getDayOfYear(date);

        if (year !== currentYear) {
            currentYear = year;
            updateR0Values(year, dayOfYear);
        } else {
            geojsonLayer.eachLayer(function (layer) {
                var kreisId = layer.feature.properties.ID_3;
                var csvFilePath = `/data/R0_mn/R0_${year}.csv`;

                $.get(csvFilePath, function (csvData) {
                    var rows = csvData.split('\n');
                    var r0Value = null;

                    for (var i = 1; i < rows.length; i++) {
                        var columns = rows[i].split(',');
                        if (columns[3] == kreisId) { // ID_3 is the 4th column (index 3)
                            r0Value = columns[4 + dayOfYear]; // mn_1 starts from the 5th column (index 4)
                            break;
                        }
                    }

                    if (r0Value !== null) {
                        layer.bindPopup('R0 Mean Value: ' + r0Value).openPopup();
                    } else {
                        layer.bindPopup('No data available').openPopup();
                    }
                });
            });
        }
    });
});