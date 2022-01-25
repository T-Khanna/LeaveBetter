<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { toMoment, toMomentDuration } from '@fullcalendar/moment'

async function getHolidayData() {
  let url = "https://www.googleapis.com/calendar/v3/calendars/en-gb.uk.official%23holiday%40group.v.calendar.google.com/events?key=AIzaSyAFUS5ZZnoWq2IsGFBurjk4QJsDpIuCZXY"
  let response = await fetch(url);
  let data = await response.json();

  var dict = {}

  data.items.forEach(function(event) {
    console.log(event.summary)
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

function calculateTimeoff(startDate, endDate, calendar) {
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

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        dateClick: this.handleDateClick,
        events: [
        { title: 'event 1', date: '2022-01-24' },
        { title: 'event 2', date: '2022-01-25' }
        ],
        weekends: false, // initial value
        firstDay : 1,
        editable: true,
        selectable: true,
        select: this.handleDateSelect,
        timeZone: 'UTC'
      }
    }
  },
  methods: {
   // handleDateClick: function(arg) {
   //   alert('date click! ' + arg.dateStr)
   // },
     toggleWeekends: function() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
    },
    select: function(info) {
      alert('selected ' + info.startStr + ' to ' + info.endStr);
    },
    handleDateSelect(selectInfo) {
      let title = prompt('Please enter a new title for your event')
      let calendar = selectInfo.view.calendar
        calendar.unselect() // clear date selection
      
      let daysOff = calculateTimeoff(selectInfo.start, selectInfo.end, selectInfo.view.calendar)


      alert(`You have taken ${daysOff} days OOTO!`, daysOff);

      if (title) {
       calendar.addEvent({
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
      }
    },
  }
}
</script>
<template>
  <button @click="toggleWeekends">toggle weekends</button>
  <FullCalendar :options="calendarOptions" />
</template>