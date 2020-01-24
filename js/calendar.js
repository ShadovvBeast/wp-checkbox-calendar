function JustADate(initDate){
    var utcMidnightDateObj = null
    // if no date supplied, use Now.
    if(!initDate)
        initDate = new Date();

    // if initDate specifies a timezone offset, or is already UTC, just keep the date part, reflecting the date _in that timezone_
    if(typeof initDate === "string" && initDate.match(/((\+|-)\d{2}:\d{2}|Z)$/gm)){
        utcMidnightDateObj = new Date( initDate.substring(0,10) + 'T00:00:00Z');
    } else {
        // if init date is not already a date object, feed it to the date constructor.
        if(!(initDate instanceof Date))
            initDate = new Date(initDate);
        // Vital Step! Strip time part. Create UTC midnight dateObj according to local timezone.
        utcMidnightDateObj = new Date(Date.UTC(initDate.getFullYear(),initDate.getMonth(), initDate.getDate()));
    }

    return {
        toIsoString:()=>utcMidnightDateObj.toIsoString(),
        getUTCDate:()=>utcMidnightDateObj.getUTCDate(),
        getUTCDay:()=>utcMidnightDateObj.getUTCDay(),
        getUTCFullYear:()=>utcMidnightDateObj.getUTCFullYear(),
        getUTCMonth:()=>utcMidnightDateObj.getUTCMonth(),
        setUTCDate:(arg)=>utcMidnightDateObj.setUTCDate(arg),
        setUTCFullYear:(arg)=>utcMidnightDateObj.setUTCFullYear(arg),
        setUTCMonth:(arg)=>utcMidnightDateObj.setUTCMonth(arg),
        addDays:(days)=>{
            utcMidnightDateObj.setUTCDate(utcMidnightDateObj.getUTCDate + days)
        },
        toString:()=>utcMidnightDateObj.toString(),
        toLocaleDateString:(locale,options)=>{
            options = options || {};
            options.timezone = "UTC";
            locale = locale || "en-EN";
            return utcMidnightDateObj.toLocaleDateString(locale,options)
        }
    }
}

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
            }
            // alert('Clicked on: ' + info.dateStr);
            // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
            // alert('Current view: ' + info.view.type);
            // // change the day's background color just for fun
            // info.dayEl.style.backgroundColor = 'red';
        }
    });

    calendar.render();
});