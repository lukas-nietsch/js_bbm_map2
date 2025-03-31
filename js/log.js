// Display the last update date in the HTML
export async function getLastLogDate() {
    const logFilePath = './log/latest_update.txt';

    try {
        // Fetch the logfile
        const response = await fetch(logFilePath);
        if (!response.ok) {
            console.error('Failed to fetch the log file.');
            return null;
        }

        // Read the content of the logfile as a string
        const logDate = await response.text();
        return logDate.trim() // Return the raw string, trimmed of whitespace
    } catch (error) {
        console.error('Error fetching the logfile: ', error);
        return null;
    }
}

async function displayLastUpdateDate() {
    const lastUpdateDate = await getLastLogDate();
    const lastUpdateElement = document.getElementById('last-update');

    if (lastUpdateDate) {
        lastUpdateElement.textContent = lastUpdateDate;
    } else {
        lastUpdateElement.textContent = 'Keine Daten verfügbar';
    }
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', displayLastUpdateDate);