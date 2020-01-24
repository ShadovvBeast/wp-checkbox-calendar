document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        locales: FullCalendarLocales,
        locale: 'he',
        plugins: [FullCalendarDayGrid.default, FullCalendarInteraction.default],
        defaultView: 'dayGridMonth',
        height: 'auto',
        fixedWeekCount: false,
        dateClick: async function(info) {
            const today = new Date();
            today.setHours(0,0,0,0);
            if (info.date >= today) {
                today.setDate(today.getDate() + 1);
                console.log(await (await fetch(ajax_object.ajax_url, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cache-Control': 'no-cache',
                    },
                    body: "action=checkbox_check&date=" + today.toISOString().split('T')[0]
                })).text());
            }}
    });
    calendar.render();

    if (ajax_object.checked.length) {
        const check_dates = ajax_object.checked.map(c => c.check_date);
        const first_check_date = new Date(check_dates[0]);
        const first_plus_week = new Date(first_check_date);
        first_plus_week.setDate(first_plus_week.getDate() + 6);
        const elements = document.querySelectorAll('.fc-day.fc-today, .fc-day.fc-future');
        for(const element of elements) {
            const date = new Date(element.dataset.date);
            if (date <= first_plus_week) {
                element.style.verticalAlign = 'bottom';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = check_dates.indexOf(element.dataset.date) > -1;
                checkbox.disabled = element.className.indexOf('fc-future') > -1 || checkbox.checked;
                element.append(checkbox);
            }
        }
    }
});