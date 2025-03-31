const translations = {
    de: { 
        headline: "Risikokarte West-Nil-Virus",
        tabAbout: "Über die Karte",
        tabSettings: "Karteneinstellungen",
        tabTimeSeries: "Zeitreihe",
        tabAboutContent: "<br> Aktuell können in der Risikokarte die Ergebnisse des epidemiologischen Modells seit 2017 bis heute und zusätzlich die nächsten 30 Tage angezeigt werden. </br><br> Die Risikokarte zeigt die Ergebnisse des epidemiologischen Modells als Basisreproduktionszahl R0. Dieser Wert sagt aus, wie viele Individuen ohne Immunität von einem infizierten Individuum angesteckt werden können. Liegt der Wert über längerem Zeitraum über 1 bereitet sich die Krankheit aus. <br><br> Das Modell berücksichtigt sowohl die Vektorpopulation (Population der Mücken, die das Virus übertragen), als auch die Krankheitsübertragung zwischen den Vektoren und verschiedenen Wirtsvögeln. </br><br> In den Karteneinstellungen können Sie auswählen, welcher Tag angezeigt werden soll. Außerdem können für beliebige Landkreise oder Städte Zeitreihen der R0-Wert Entwicklung erstellt werden. </br>",
        tabSettingsContent1: "<h4>Kartenanzeige</h4> Wählen Sie hier einen Tag aus, für den die Risikokarte angezeigt werden soll.",
        tabSettingsContent2: "<h4>R0-Werte Anzeige</h4> Standardmäßig werden die modellierten R0-Werte als Bilddaten angezeigt. Alternativ kann der Mittelwert der Landkreise angezeigt werden.",
        tabSettingsSwitchRasterVektor: "Mittelwerte für Verwaltungsbezirke",
        tabTimeSeriesContent1: "<h4>Zeitreihen Graph</h4> Wählen Sie hier einen Zeitraum und einen Landkreis aus, für den die Zeitreihe angezeigt werden soll.",
        tabTimeSeriesContent2: "Start Datum", 
        tabTimeSeriesContent3: "End Datum",
        tabTimeSeriesContent4: "Landkreis auswählen",
        footerText: `
        <p><small> BayByeMos ist ein Projekt des Lehrstuhls <a href="https://www.biogeo.uni-bayreuth.de" target="_blank">Biogeografie</a> und des 
            <a href="https://www.img.uni-bayreuth.de/de/index.html" target="_blank">Instituts für Medizinmanagement und Gesundheitswissenschaften</a> der Universität Bayreuth. <br>
            Das Projekt wird im Rahmen des <a href="https://www.vkg.bayern.de/" target="_blank">Verbundprojekt "Klimawandel und Gesundheit"</a> in Bayern (VKG) gefördert. <br>

            <p><small>
                Letzte Aktualisierung: <span id="last-update"></span> <br>
                © 2025 Copyright:
                <a class="text-dark" href="https://www.biogeo.uni-bayreuth.de/biogeo/?lang=de">Biogeographie, Universität Bayreuth,</a>
                <a href="https://www.bayceer.uni-bayreuth.de/BayByeMos/de/top/gru/impressum.php">Impressum,</a>
                <a href="mailto:baybyemos@uni-bayreuth.de">Kontakt</a>
            </small></p>
        </small></p>
        `
    },
    en: { 
        headline: "Risk Map - West-Nil-Virus",
        tabAbout: "About the map",
        tabSettings: "Map settings",
        tabTimeSeries: "Time series",
        tabAboutContent: "<br>The risk map currently shows the results of the epidemiological model since 2017 to date and also the next 30 days.</br> <br>The risk map shows the results of the epidemiological model as the basic reproduction number R0. This value indicates how many individuals without immunity can be infected by an infected individual. If the value is above 1 over a longer period of time, the disease spreads.</br> <br>The model takes into account both the vector population (population of mosquitoes that transmit the virus) and the disease transmission between the vectors and different host birds.</br> <br>In the map settings, you can select which day should be displayed. In addition, time series of the R0 value development can be created for any counties or cities.</br>",
        tabSettingsContent1: "<h4>Display Date</h4> Select a day here for which the risk map is to be displayed.",
        tabSettingsContent2: "<h4>Display R0-Value</h4> By default, the modeled R0 values are displayed as image data. Alternatively, the average value of the counties can be displayed.",
        tabSettingsSwitchRasterVektor: "Mean values for administrative districts",
        tabTimeSeriesContent1: "<h4>Timeseries Graph</h4> Select a time period and a district for which the time series is to be displayed.",
        tabTimeSeriesContent2: "Start Date", 
        tabTimeSeriesContent3: "End Date",
        tabTimeSeriesContent4: "Select district",
        footerText: `
        <p><small> BayByeMos is a project of the Department of <a href="https://www.biogeo.uni-bayreuth.de" target="_blank">Biogeography</a> and the 
            <a href="https://www.img.uni-bayreuth.de/de/index.html" target="_blank">Institute for Medical Management and Health Sciences</a> of the University of Bayreuth. <br> 
            The project is funded as part of the joint project <a href="https://www.vkg.bayern.de/" target="_blank">"Climate Change and Health"</a> in Bavaria (VKG). <br> 
            
            <p><small>
                Last updated: <span id="last-update"></span> <br>
                © 2025 Copyright:<a class="text-dark" href="https://www.biogeo.uni-bayreuth.de/biogeo/?lang=de">Biogeography, University of Bayreuth,</a>
                <a href="https://www.bayceer.uni-bayreuth.de/BayByeMos/de/top/gru/impressum.php">Impressum,</a>
                <a href="mailto:baybyemos@uni-bayreuth.de">Kontakt</a>
            </small></p>
        </small></p>
        `
    }
};

let currentLang = "de";

import { getLastLogDate } from './log.js';

async function switchLanguage() {
    currentLang = currentLang === "de" ? "en" : "de";

    document.getElementById("headline").innerText = translations[currentLang].headline;
    document.getElementById("tabAbout").innerText = translations[currentLang].tabAbout;
    document.getElementById("tabSettings").innerText = translations[currentLang].tabSettings;
    document.getElementById("tabTimeSeries").innerText = translations[currentLang].tabTimeSeries;
    document.getElementById("tabAboutContent").innerHTML = translations[currentLang].tabAboutContent;
    document.getElementById("tabSettingsContent1").innerHTML = translations[currentLang].tabSettingsContent1;
    document.getElementById("tabSettingsContent2").innerHTML = translations[currentLang].tabSettingsContent2;
    document.getElementById("tabSettingsSwitchRasterVektor").innerText = translations[currentLang].tabSettingsSwitchRasterVektor;
    document.getElementById("tabTimeSeriesContent1").innerHTML = translations[currentLang].tabTimeSeriesContent1;
    document.getElementById("tabTimeSeriesContent2").innerHTML = translations[currentLang].tabTimeSeriesContent2;
    document.getElementById("tabTimeSeriesContent3").innerHTML = translations[currentLang].tabTimeSeriesContent3;
    document.getElementById("tabTimeSeriesContent4").innerHTML = translations[currentLang].tabTimeSeriesContent4;
    document.getElementById("footerText").innerHTML = translations[currentLang].footerText;
    
    const lastUpdateDate = await getLastLogDate();
    document.getElementById('last-update').textContent = lastUpdateDate || 'No data available';
    
    document.getElementById("langSwitch").innerText = currentLang === "de" ? "Switch to English" : "Auf Deutsch wechseln";


}

document.getElementById("langSwitch").addEventListener("click", switchLanguage);