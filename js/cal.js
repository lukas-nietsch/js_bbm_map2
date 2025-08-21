import {currentLang} from './translation.js';

export let fp = null;

export function getDatepickerSelection(mode, selectedDates) {
    if (!selectedDates.length) return [];

    if (mode === 'daily') {
        var day = selectedDates[0];
        //console.log('Selected date:', day);
        return [day];
    }

    if (mode === 'weekly') {
        let base = selectedDates[0];
        let day = base.getDay();
        let diff = (day === 0 ? -6 : 1) - day; // Adjust to start of the week (Monday)
        let monday = new Date(base);
        monday.setDate(base.getDate() + diff);

        let week = [];
        for (let i = 0; i < 7; i++) {
            let d = new Date(monday);
            d.setDate(monday.getDate() + i);
            week.push(d);
        }
        //console.log('Selected week:', week);
        return week;
    }

    if (mode === 'monthly') {
        let first = new Date(selectedDates[0].getFullYear(), selectedDates[0].getMonth(), 1);
        let last = new Date(selectedDates[0].getFullYear(), selectedDates[0].getMonth() + 1, 0);

        let month = [];
        let d = new Date(first);
        while (d <= last) {
            month.push(new Date(d));
            d.setDate(d.getDate() + 1);
        }
        //console.log('Selected month:', month);
        return month;
    }

    console.warn('Unknown mode:', mode);
    return [];
}
    
export function initFlatpickr(mode, selectedDate = null) {
    if (fp) fp.destroy(); // remove previous instance

    let locale = currentLang;
    if (locale === "en") locale = "default";

    let baseOptions = {
        locale: flatpickr.l10ns[locale],
        weekNumbers: true,
        altInput: true,
        defaultDate: selectedDate ? selectedDate : new Date()
    };

    if (mode === 'daily') {
        let altFormatWeekly = currentLang === "en" ? "Y-m-d" : "d.m.Y";

        fp = flatpickr("#datepicker-mean", {
            ...baseOptions,
            dateFormat: "d-m-Y",
            altFormat: altFormatWeekly,
            mode: "single",
        });
    }

    if (mode === 'weekly') {
        let altFormatWeekly = currentLang === "en" ? "\\C\\W W, Y" : "\\K\\W W, Y";

        fp = flatpickr("#datepicker-mean", {
            ...baseOptions,
            plugins: [new weekSelect({})],
            dateFormat: "W, Y",
            altFormat: altFormatWeekly
        });
    }

    if (mode === 'monthly') {
        fp = flatpickr("#datepicker-mean", {
            ...baseOptions,
            weekNumbers: false,
            plugins: [
                new monthSelectPlugin({
                    shorthand: true, // use short month names
                    dateFormat: "m-Y",
                    altFormat: "F, Y",
                })
            ]
        });
    }
}

export function getCurrentMode() {
    let selectedValue = document.querySelector('.btnPeriod:checked').value;
    //console.log('Current mode:', selectedValue);
    return selectedValue;
}