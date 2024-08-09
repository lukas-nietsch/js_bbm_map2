// Declare map variable globally so all functions have access
///////////////////////////////////////////////////////////////////////////////////////////////////
// Create basic map
var map = L.map('map', {
    center: [51.125, 10.375],
    zoom: 6,
    scrollWheelZoom: true,
    dragging: true
})

// Basemaps
var OSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
