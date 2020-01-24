document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        locales: FullCalendarLocales,
        locale: 'he',
        plugins: [FullCalendarDayGrid.default, FullCalendarInteraction.default],
        defaultView: 'dayGridMonth',
        height: 'auto',
        fixedWeekCount: false,
        dateClick: function(info) {
            const today = new Date();
            today.setHours(0,0,0,0);
            if (info.date >= today)
                alert('START!');
            // alert('Clicked on: ' + info.dateStr);
            // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
            // alert('Current view: ' + info.view.type);
            // // change the day's background color just for fun
            // info.dayEl.style.backgroundColor = 'red';
        }
    });

    calendar.render();
});