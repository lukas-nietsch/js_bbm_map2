document.addEventListener("DOMContentLoaded", function() {
    // Get the datepicker element by its id
    const datepicker_main = document.getElementById("datepicker");

    // Get todays date
    const today = new Date().toISOString().split('T')[0];

    // Set today as default value for the datepicker
    datepicker_main.value = today;
    console.log("Default Date:", datepicker_main.value);

    // Add event listener to log the selected date whenever it changes
    datepicker_main.addEventListener('change', function() {
        console.log("Selected date:", datepicker.value);
    });
});