document.addEventListener('DOMContentLoaded', function() {
    console.log('init fullcalendar');
    const calendarEl = document.getElementById('calendar');
    const calendar = new _fullcalendar_core.Calendar(calendarEl, {
        locales: FullCalendarLocales,
        locale: 'he',
        plugins: [_fullcalendar_daygrid.default, _fullcalendar_interaction.default],
        defaultView: 'dayGridMonth',
        height: 'auto',
        fixedWeekCount: false,
        dateClick: function(info) {
            alert('Clicked on: ' + info.dateStr);
            alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
            alert('Current view: ' + info.view.type);
            // change the day's background color just for fun
            info.dayEl.style.backgroundColor = 'red';
        }
    });

    calendar.render();
});