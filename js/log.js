async function getLastLogDate() {
    const logFilePath = './log/latest_update.txt'; // Path to the logfile

    try {
        // Fetch the logfile
        const response = await fetch(logFilePath);
        if (!response.ok) {
            console.error('Failed to fetch the logfile.');
            return null;
        }

        // Read the date from the logfile
        const logDate = await response.text();
        const parsedDate = new Date(logDate.trim()); // Trim whitespace and parse the date

        // Validate the date
        if (!isNaN(parsedDate)) {
            return parsedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        } else {
            console.error('Invalid date in the logfile.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching the logfile:', error);
        return null;
    }
}

// Display the last update date in the HTML
async function displayLastUpdateDate() {
    const lastUpdateDate = await getLastLogDate();
    const lastUpdateElement = document.getElementById('last-update');

    if (lastUpdateDate) {
        lastUpdateElement.textContent = lastUpdateDate;
    } else {
        lastUpdateElement.textContent = 'Keine Daten verfügbar'; // "No data available" in German
    }
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', displayLastUpdateDate);