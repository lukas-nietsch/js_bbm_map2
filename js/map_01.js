//declare map variable globally so all functions have access

///////////////////////////////////////////////////////////////////////////////////////////////////
///// Create basic map
var map = L.map('map').setView([51.125, 10.375], 6)

// Basemaps
var OSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var OSM_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);

///////////////////////////////////////////////////////////////////////////////////////////////////
///// FUNCTIONS


///////////////////////////////////////////////////////////////////////////////////////////////////
///// Add GeoJSON Data - Kreise with mean r0 values
var json_path = '/data/r0_2019.geojson'

// Fetch the GeoJSON data and add it to the map
fetch(json_path)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        var jsonLayer = L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<b>Landkreis: </b>` + feature.properties.NAME_3);
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
            "Raster Image": img,
            "Landkreisgrenzen": jsonLayer
        };

        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);
    })
    .catch(error => {
        console.error('Error fetching the GeoJSON data:', error);
    });


///////////////////////////////////////////////////////////////////////////////////////////////////
///// Add Raster Images as png ImageOverlay - NOTE: All files must have the exact same Extent!

// Extents of the Germany Raster: 
var ext_ger = [[47.2500000000000000, 5.7500000000000000], [55.0000000000000000, 15.0000000000000000]]
// Extents of the Bavaria Raster: 
var ext_bav = [[46.7187500000000000, 8.4687500000000000], [51.0937500000000000, 14.3437500000000000]]

var img_path = '/data/png/colored_img_216.png'

var img = L.imageOverlay(image = img_path, 
    bounds = ext_bav,
    opacity = 0.8).addTo(map)

///////////////////////////////////////////////////////////////////////////////////////////////////
///// Layer Controller
var baseMaps = {
    "Open Street Map": OSM,
    "Open Street Map - Hot": OSM_HOT
};
