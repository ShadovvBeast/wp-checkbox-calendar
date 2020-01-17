document.addEventListener('DOMContentLoaded', function() {
    console.log('init fullcalendar');
    const calendarEl = document.getElementById('calendar');
    const calendar = new _fullcalendar_core.Calendar(calendarEl, {
        plugins: [_fullcalendar_daygrid.default]
    });

    calendar.render();
});