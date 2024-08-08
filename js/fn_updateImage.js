///////////////////////////////////////////////////////////////////////////////////////////////////
// Add Raster Images as png ImageOverlay - NOTE: All files must have the exact same Extent!

// Extents of the Germany Raster: 
var ext_ger = [[47.25, 5.75], [55.00, 15.00]];
var imgLayer;

// Function to update the image overlay based on the selected date
export function updateImage(date) {
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