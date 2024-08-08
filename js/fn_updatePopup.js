// POPUP Update Function 
export function updatePopup(feature, layer) {
    var attributeName = 'mn_' + selectedDay;
    var attributeValue = feature.properties[attributeName]
    // Check if the attribute value is a number and round it to 2 decimal places
    if (attributeValue !== undefined && !isNaN(attributeValue)) {
        attributeValue = attributeValue.toFixed(2);
    } else {
        attributeValue = 'N/A';
    }
    layer.bindPopup(`<b>Landkreis: </b>${feature.properties.NAME_3}<br><b>Mean R0: </b>${attributeValue}`).openPopup();
}