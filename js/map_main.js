import { updateImage } from "./fn_updateImage.js";

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

///////////////////////////////////////////////////////////////////////////////////////////////////
// Initialize the DatePickers with todays date as the default

$(function() {
    var today = new Date();
    console.log(today)
    var formattedDate = today.toISOString().split('T')[0];
    console.log(formattedDate)
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