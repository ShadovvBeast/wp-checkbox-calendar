document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.elementor-element-f9066e9').style.display = 'none';
    document.querySelector('.elementor-element-a549e67').style.display = 'none';
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl)
        return;
    function isMobileDevice() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }
    async function checkDate(date) {
        return await (await fetch(calendar_ajax_object.ajax_url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache',
            },
            body: "action=checkbox_check&date=" + date
        })).text();
    }

    function handle_checked(check_object) {
        if (check_object.length) {
            const check_dates = check_object.map(c => c.check_date);
            const first_check_date = new Date(check_dates[0]);
            const compare_date = new Date(first_check_date);
            compare_date.setDate(compare_date.getDate() + 6);
            let week_index = 0;
            while (compare_date < new Date()) {
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
                    document.querySelector('.elementor-element-a549e67').style.display = 'block';
                    break;
                case 2:
                    document.querySelector('.elementor-element-f9066e9').style.display = 'block';
                    break;
            }
            const elements = document.querySelectorAll('.fc-day');
            for (const element of elements) {
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

    function getElementByDate(date) {
        return document.querySelector(`.fc-day[data-date="${date}"]`);
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
        dateClick: !calendar_ajax_object.checked.length && async function(info) {
            const today = new Date();
            today.setHours(0,0,0,0);
            if (info.date >= today) {
                today.setDate(today.getDate() + 1);
                const elem = getElementByDate(info.dateStr);
                const loader_elem = isMobileDevice() ? elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
                    : elem;

                let classes = loader_elem.className.split(" ");
                if (classes.indexOf('checkboxed') > -1)
                    return;
                classes.push('loader');
                classes.push('checkboxed');
                loader_elem.className = classes.join(' ');
                const data = await checkDate(today.toISOString().split('T')[0]);
                handle_checked(JSON.parse(data.slice(0, -1)));
                classes = loader_elem.className.split(" ");
                classes.splice(classes.indexOf('loader'), 1 );
                loader_elem.className = classes.join(' ');
            }},
        datesRender: function() {
            document.querySelectorAll('.fc-day-top').forEach(elem => {
                //elem.removeEventListener('click');
                elem.addEventListener('click', event => {
                    const checkbox = getElementByDate(elem.dataset.date).querySelector('input[type="checkbox"]');
                    if (checkbox && !checkbox.checked) {
                        checkbox.checked = true;
                        checkbox.disabled = true;
                        checkDate(elem.dataset.date);
                    }
                })
            });
            handle_checked(calendar_ajax_object.checked);
        }
    });
    calendar.render();
});