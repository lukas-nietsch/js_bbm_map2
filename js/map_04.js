// Declare map variable globally so all functions have access
///////////////////////////////////////////////////////////////////////////////////////////////////
// Create basic map
var map = L.map('map', {
        center: [51.125, 10.375],
        zoom: 6,
        scrollWheelZoom: false,
        dragging: false
    })
        
        //.setView([51.125, 10.375], 6);

// Basemaps
var OSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/* var OSM_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}) */
//.addTo(map);

///////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS

///////////////////////////////////////////////////////////////////////////////////////////////////
// Add GeoJSON Data - Kreise with mean r0 values
var json_path = '/data/kreise.geojson';
//var json_path = 'https://cloud.biogeo.uni-bayreuth.de/index.php/s/OG80IIB5M8nEB94' + '/r0_2019.geojson'
var jsonLayer;


// Fetch the GeoJSON data and add it to the map
fetch(json_path)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        jsonLayer = L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                layer.on('click', function (e) {
                    updatePopup(feature, layer);
                });
            },
            style: {
                fill: false,
//                fillOpacity: 0.1,
                color: 'black',
                weight: 0.5
            }
        }).addTo(map);

        // Add to overlayMaps
        var overlayMaps = {
            "Raster Image": imgLayer,
            "Landkreisgrenzen": jsonLayer
        };

        // Add the layer control to the map
        //L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);
    })
    .catch(error => {
        console.error('Error fetching the GeoJSON data:', error);
    });

// POPUP Update Function 
function updatePopup(feature, layer) {
    var attributeName = 'mn__' + selectedDay;
    var attributeValue = feature.properties[attributeName]
    // Check if the attribute value is a number and round it to 2 decimal places
    if (attributeValue !== undefined && !isNaN(attributeValue)) {
        attributeValue = attributeValue.toFixed(2);
    } else {
        attributeValue = 'N/A';
    }
    layer.bindPopup(`<b>Landkreis: </b>${feature.properties.NAME_3}<br><b>Mean R0: </b>${attributeValue}`).openPopup();
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Add Raster Images as png ImageOverlay - NOTE: All files must have the exact same Extent!

// Extents of the Germany Raster: 
var ext_ger = [[47.25, 5.75], [55.00, 15.00]];
// Extents of the Bavaria Raster: 
//var ext_bav = [[46.71875, 8.46875], [51.09375, 14.34375]];

var imgLayer;

// Function to update the image overlay based on the selected date
function updateImage(date) {
    selectedDay = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    var imgPath = `/data/png/colored_img_${selectedDay}.png`;

    if (imgLayer) {
        map.removeLayer(imgLayer);
    }

    imgLayer = L.imageOverlay(imgPath, ext_ger, { opacity: 0.8 }).addTo(map);

    // Update all popups with the new day
    if (jsonLayer) {
        jsonLayer.eachLayer(function (layer) {
            updatePopup(layer.feature, layer);
        });
    }
}



///////////////////////////////////////////////////////////////////////////////////////////////////
// Function to fetch mean R0 values for the date range and update the chart
function updateChart(startDate, endDate) {
    if (!jsonLayer) return;

    var startDay = Math.floor((startDate - new Date(startDate.getFullYear(), 0, 0)) / 86400000);
    var endDay = Math.floor((endDate - new Date(endDate.getFullYear(), 0, 0)) / 86400000);
    
    console.log('StartDay:', startDay, startDate);
    console.log('End Day:', endDay, endDate);

    var labels = [];
    var data = [];

    for (var i = startDay; i <= endDay; i++) {
        labels.push(i);
        var totalValue = 0;
        var count = 0;

        jsonLayer.eachLayer(function(layer) {
            var attributeName = 'mn__' + i;
            var attributeValue = layer.feature.properties[attributeName];

            if (attributeValue !== undefined && !isNaN(attributeValue)) {
                totalValue += parseFloat(attributeValue);
                count++;
            }
        });

        data.push(count ? (totalValue / count).toFixed(2) : 0);
    }

    // Log the data to the console for debugging
    console.log('Labels:', labels);
    console.log('Data:', data);

    var ctx = document.getElementById('lineChart').getContext('2d');
    if (window.myLineChart) {
        window.myLineChart.destroy();
    }
    window.myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mean R0',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        callback: function(value, index, values) {
                            return 'Day ' + value;
                        }
                    }
                }]
            }
        }
    });
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// Initialize the DatePickers with todays date as the default

$(function() {
    var today = new Date();
    var formattedDate = today.toISOString().split('T')[0];
    updateImage(today);

    $("#datepicker").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function(dateText) {
            var date = new Date(dateText);
            updateImage(date);
        }
    }).datepicker("setDate", formattedDate);
    // Update the map with today's date initially
    
    from = $("#start-datepicker").datepicker({
        defaultDate: "-7",
        changeMonth: true
    }).on("change", function() {
        to.datepicker("option", "minDate", getDate( this ) );
    }),
    to = $("#end-datepicker").datepicker({
        defaultDate: "+7",
        changeMonth: true
    }).on("change", function() {
        from.datepicker("option", "maxDate", getDate( this ));
    });

});

// Event listener for start and end date pickers
$("#start-datepicker, #end-datepicker").datepicker({
    onSelect: function() {
        var startDate = new Date($("#start-datepicker").val());
        var endDate = new Date($("#end-datepicker").val());

        updateChart(startDate, endDate);
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////
// Layer Controller
/* var baseMaps = {
    "Open Street Map": OSM,
    "Open Street Map - Hot": OSM_HOT
}; */