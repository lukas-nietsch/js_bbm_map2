const translations = {
    de: { 
        headline: "Risikokarte West-Nil-Virus",
        tabAbout: "Über die Karte",
        tabSettings: "Karteneinstellungen",
        tabTimeSeries: "Zeitreihe",
        tabAboutContent: "<br> Aktuell können in der Risikokarte die Ergebnisse des epidemiologischen Modells seit 2017 bis heute angezeigt werden. </br><br> Die Risikokarte zeigt die Ergebnisse des epidemiologischen Modells als Basisreproduktionszahl R0. Dieser Wert sagt aus, wie viele Individuen ohne Immunität von einem infizierten Individuum angesteckt werden können. Liegt der Wert über längerem Zeitraum über 1 bereitet sich die Krankheit aus. <br><br> Das Modell berücksichtigt sowohl die Vektorpopulation (Population der Mücken, die das Virus übertragen), als auch die Krankheitsübertragung zwischen den Vektoren und verschiedenen Wirtsvögeln. </br><br> In den Karteneinstellungen können Sie auswählen, welcher Tag angezeigt werden soll. Außerdem können für beliebige Landkreise oder Städte Zeitreihen der R0-Wert Entwicklung erstellt werden. </br>",
        tabSettingsContent1: "<h4>Dargestellter Zeitraum</h4> Wählen Sie hier aus, ob die täglich modellierten Werte, oder wöchentliche oder monatliche Mittelwerte angezeigt werden sollen.",
        tabSettingsContent2: "Täglich",
        tabSettingsContent3: "Wöchentlich",
        tabSettingsContent4: "Monatlich",
        tabSettingsContent5: "<h4>R0-Werte Anzeige</h4> Standardmäßig werden die modellierten R0-Werte als Mittelwerte der Landkreise bzw. kreisfreien Städte angezeigt. Alternativ können auch die modellierten Tageswerte als Raster bzw. Bild angezeigt werden.",
        tabSettingsSwitchRasterVektor: "Tageswerte als Bild",
        tabTimeSeriesContent1: "<h4>Zeitreihen Graph</h4> Wählen Sie hier einen Zeitraum und einen Landkreis aus, für den die Zeitreihe angezeigt werden soll.",
        tabTimeSeriesContent2: "Start Datum", 
        tabTimeSeriesContent3: "End Datum",
        tabTimeSeriesContent4: "Landkreis auswählen",
        tabActions: "Maßnahmen",
        tabActionsContent1: "<h4>Schutzmaßnahmen</h4>",
        tabActionsContent2: "Der beste Schutz vor einer Erkrankung durch das West-Nil-Virus ist die Vermeidung von Mückenstichen. Besonders vulnerable Personen sollten diese Punkte beachten:",
        tabActionsContent3: "Vermeiden Sie Aufenthalte im Freien in der Dämmerung und nachts, wenn die Mücken am aktivsten sind.",
        tabActionsContent4: "Tragen Sie helle, langärmlige Kleidung, um Stiche zu vermeiden.",
        tabActionsContent5: "Verwenden Sie bei Bedarf zusätzliche Mücken-abwehrende Mittel (Repellents).",
        tabActionsContent6: "Installieren Sie Fliegengitter an Fenstern und Türen, um Mücken fernzuhalten.",
        tabActionsContent7: "Entfernen oder decken Sie stehendes Wasser in der Nähe Ihres Wohnbereichs ab, um Brutstätten für Mücken zu minimieren.",
        tabActionsContent8: `
                            Weitere Informationen erhalten Sie auf diesen Seiten: <br>
                                <a href="https://www.rki.de/DE/Themen/Infektionskrankheiten/Infektionskrankheiten-A-Z/W/West-Nil-Fieber/West-Nil-Fieber_Ueberblick.html" target="_blank">Robert-Koch-Institut</a> <br>
                                <a href="https://www.infektionsschutz.de/erregersteckbriefe/west-nil-fieber/" target="_blank">Infektionsschutz - West-Nil-Virus</a> <br>`,                                    
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
        tabAboutContent: "<br>The risk map currently shows the results of the epidemiological model since 2017 to date.</br> <br>The risk map shows the results of the epidemiological model as the basic reproduction number R0. This value indicates how many individuals without immunity can be infected by an infected individual. If the value is above 1 over a longer period of time, the disease spreads.</br> <br>The model takes into account both the vector population (population of mosquitoes that transmit the virus) and the disease transmission between the vectors and different host birds.</br> <br>In the map settings, you can select which day should be displayed. In addition, time series of the R0 value development can be created for any counties or cities.</br>",
        tabSettingsContent1: "<h4>Displayed Time range</h4> Select here whether you want to display the daily modeled values or weekly or monthly averages.",
        tabSettingsContent2: "Daily",
        tabSettingsContent3: "Weekly",
        tabSettingsContent4: "Monthly",
        tabSettingsContent5: "<h4>Display R0-Value</h4> By default, the modeled R0 values are displayed as averages for the counties or cities. Alternatively, the modeled daily values can also be displayed as a grid or image.",
        tabSettingsSwitchRasterVektor: "Daily values as image",
        tabTimeSeriesContent1: "<h4>Timeseries Graph</h4> Select a time period and a district for which the time series is to be displayed.",
        tabTimeSeriesContent2: "Start Date", 
        tabTimeSeriesContent3: "End Date",
        tabTimeSeriesContent4: "Select district",
        tabActions: "Actions",
        tabActionsContent1: "<h4>Protective measures</h4>",
        tabActionsContent2: "The best protection against West Nile virus infection is to avoid mosquito bites. Particularly vulnerable individuals should observe the following precautions:",
        tabActionsContent3: "Avoid staying outdoors at dusk and at night when mosquitoes are most active.",
        tabActionsContent4: "Wear light-colored, long-sleeved clothing to avoid bites.",
        tabActionsContent5: "Use additional mosquito repellents if necessary.",
        tabActionsContent6: "Install fly screens on windows and doors to keep mosquitoes out.",
        tabActionsContent7: "Remove or cover standing water near your living area to minimize breeding grounds for mosquitoes.",
        tabActionsContent8: `Further information is available on these pages:
                             <br>
                                <a href="https://www.rki.de/DE/Themen/Infektionskrankheiten/Infektionskrankheiten-A-Z/W/West-Nil-Fieber/West-Nil-Fieber_Ueberblick.html" target="_blank">Robert-Koch-Institute</a> <br>
                                <a href="https://www.infektionsschutz.de/erregersteckbriefe/west-nil-fieber/" target="_blank">Infection control - West-Nile-Virus</a> <br>`,
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

export let currentLang = "de";

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
    document.getElementById("tabSettingsContent3").innerHTML = translations[currentLang].tabSettingsContent3;
    document.getElementById("tabSettingsContent4").innerHTML = translations[currentLang].tabSettingsContent4;
    document.getElementById("tabSettingsContent5").innerHTML = translations[currentLang].tabSettingsContent5;
    document.getElementById("tabSettingsSwitchRasterVektor").innerText = translations[currentLang].tabSettingsSwitchRasterVektor;
    document.getElementById("tabTimeSeriesContent1").innerHTML = translations[currentLang].tabTimeSeriesContent1;
    document.getElementById("tabTimeSeriesContent2").innerHTML = translations[currentLang].tabTimeSeriesContent2;
    document.getElementById("tabTimeSeriesContent3").innerHTML = translations[currentLang].tabTimeSeriesContent3;
    document.getElementById("tabTimeSeriesContent4").innerHTML = translations[currentLang].tabTimeSeriesContent4;
    document.getElementById("tabActions").innerHTML = translations[currentLang].tabActions;
    document.getElementById("tabActionsContent1").innerHTML = translations[currentLang].tabActionsContent1;
    document.getElementById("tabActionsContent2").innerHTML = translations[currentLang].tabActionsContent2;
    document.getElementById("tabActionsContent3").innerHTML = translations[currentLang].tabActionsContent3;
    document.getElementById("tabActionsContent4").innerHTML = translations[currentLang].tabActionsContent4;
    document.getElementById("tabActionsContent5").innerHTML = translations[currentLang].tabActionsContent5;
    document.getElementById("tabActionsContent6").innerHTML = translations[currentLang].tabActionsContent6;
    document.getElementById("tabActionsContent7").innerHTML = translations[currentLang].tabActionsContent7;
    document.getElementById("tabActionsContent8").innerHTML = translations[currentLang].tabActionsContent8;

    document.getElementById("footerText").innerHTML = translations[currentLang].footerText;
    
    const lastUpdateDate = await getLastLogDate();
    document.getElementById('last-update').textContent = lastUpdateDate || 'No data available';
    
    document.getElementById("langSwitch").innerText = currentLang === "de" ? "🇬🇧 English" : "🇩🇪 Deutsch";
}

document.getElementById("langSwitch").addEventListener("click", switchLanguage);