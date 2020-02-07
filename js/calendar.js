document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl)
        return;
    async function checkDate(date) {
        await (await fetch(calendar_ajax_object.ajax_url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache',
            },
            body: "action=checkbox_check&date=" + date
        })).text();
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        locales: FullCalendarLocales,
        locale: 'he',
        plugins: [FullCalendarDayGrid.default, FullCalendarInteraction.default],
        defaultView: 'dayGridMonth',
        height: 'auto',
        contentHeight: 'auto',
        aspectRatio: 1,
        fixedWeekCount: false,
        dayNames: ['z1','z2','z3','z4','z5','z6','z7'],
        dayNamesShort: ['z1','z2','z3','z4','z5','z6','z7'],
        dateClick: async function(info) {
            const today = new Date();
            today.setHours(0,0,0,0);
            if (info.date >= today) {
                today.setDate(today.getDate() + 1);
                await checkDate(today.toISOString().split('T')[0]);
            }},
        datesRender: function() {
            document.querySelectorAll('.fc-day-top').forEach(elem => {
                //elem.removeEventListener('click');
                elem.addEventListener('click', event => {
                    const checkbox = document.querySelector(`.fc-day[data-date="${elem.dataset.date}"]`).querySelector('input[type="checkbox"]');
                    if (checkbox && !checkbox.checked) {
                        checkbox.checked = true;
                        checkbox.disabled = true;
                        checkDate(elem.dataset.date);
                    }
                })
            });
            if (calendar_ajax_object.checked.length) {
                const check_dates = calendar_ajax_object.checked.map(c => c.check_date);
                const first_check_date = new Date(check_dates[0]);
                const compare_date = new Date(first_check_date);
                compare_date.setDate(compare_date.getDate() + 6);
                let week_index = 0;
                while(compare_date < new Date()) {
                    compare_date.setDate(compare_date.getDate() + 7);
                    week_index++;
                }
                switch (week_index) {
                    case 0:
                        document.querySelector('.elementor-element-f9066e9').style.display = 'none';
                        document.querySelector('.elementor-element-a549e67').style.display = 'none';
                        break;
                    case 1:
                        document.querySelector('.elementor-element-a549e67').style.display = 'none';
                        break;
                    case 2:
                        document.querySelector('.elementor-element-f9066e9').style.display = 'none';
                        break;
                }
                const elements = document.querySelectorAll('.fc-day');
                for(const element of elements) {
                    const date = new Date(element.dataset.date);
                    if (date <= compare_date && date >= first_check_date) {
                        element.style.verticalAlign = 'bottom';
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.checked = check_dates.indexOf(element.dataset.date) > -1;
                        checkbox.disabled = element.className.indexOf('fc-future') > -1 || checkbox.checked;
                        element.append(checkbox);
                    }
                }
            }
        }
    });
    calendar.render();
});