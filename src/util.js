import { toMoment, toMomentDuration } from '@fullcalendar/moment'

async function getHolidayData() {
    let url = "https://www.googleapis.com/calendar/v3/calendars/en-gb.uk.official%23holiday%40group.v.calendar.google.com/events?key=AIzaSyAFUS5ZZnoWq2IsGFBurjk4QJsDpIuCZXY"
    let response = await fetch(url);
    let data = await response.json();

    var dict = {}

    data.items.forEach(function (event) {
        if (event.summary.includes("(Scotland)") || event.summary.includes("(Northern Ireland)")) {
            // ignore
        } else {
            dict[event.start.date] = event.summary
        }
    })

    return dict;
}

const holidayMappings = await getHolidayData()
console.log(`Loaded the data '${JSON.stringify(holidayMappings)}'`)

export function calculateTimeoff(startDate, endDate, calendar) {
    let start = toMoment(startDate, calendar)
    let end = toMoment(endDate, calendar)
    let days = toMomentDuration(end.diff(start)).asDays()

    var workDays = 0
    for (var d = 0; d < days; d++) {
        var currTimestamp = start.day(d)
        var currDay = currTimestamp.day()
        if (currDay == 5 || currDay == 6 || currTimestamp.format('YYYY-MM-DD') in holidayMappings) {
            // do nothing
        } else {
            workDays++
        }
    }

    return workDays
}
