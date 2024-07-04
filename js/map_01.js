// Declare map variable globally so all functions have access
///////////////////////////////////////////////////////////////////////////////////////////////////
// Create basic map
var map = L.map('map').setView([51.125, 10.375], 6);

// Basemaps
var OSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var OSM_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);

///////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS

///////////////////////////////////////////////////////////////////////////////////////////////////
// Add GeoJSON Data - Kreise with mean r0 values
var json_path = '/data/r0_2019.geojson';

var jsonLayer;
var selectedDay = 1; // default to the first day of the year

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
                fillColor: 'red',
                fillOpacity: 0.1,
                color: 'black',
                weight: 1
            }
        }).addTo(map);

        // Add to overlayMaps
        var overlayMaps = {
            "Raster Image": imgLayer,
            "Landkreisgrenzen": jsonLayer
        };

        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);
    })
    .catch(error => {
        console.error('Error fetching the GeoJSON data:', error);
    });

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
var ext_bav = [[46.71875, 8.46875], [51.09375, 14.34375]];

var imgLayer;

// Function to update the image overlay based on the selected date
function updateImage(date) {
    selectedDay = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    var imgPath = `/data/png/colored_img_${selectedDay}.png`;

    if (imgLayer) {
        map.removeLayer(imgLayer);
    }

    imgLayer = L.imageOverlay(imgPath, ext_bav, { opacity: 0.8 }).addTo(map);

    // Update all popups with the new day
    if (jsonLayer) {
        jsonLayer.eachLayer(function (layer) {
            updatePopup(layer.feature, layer);
        });
    }
}

// Initialize the DatePicker with todays date as the default
$(function() {
    var today = new Date();
    var formattedDate = today.toISOString().split('T')[0];
    $("#datepicker").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function(dateText) {
            var date = new Date(dateText);
            updateImage(date);
        }
    }).datepicker("setDate", formattedDate);

    // Update the map with today's date initially
    updateImage(today);
});

///////////////////////////////////////////////////////////////////////////////////////////////////
// Layer Controller
var baseMaps = {
    "Open Street Map": OSM,
    "Open Street Map - Hot": OSM_HOT
};

// The overlayMaps creation is moved into the fetch block since it relies on the jsonLayer being defined after fetching data
