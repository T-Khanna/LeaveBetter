<script>
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

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
        select: this.handleDateSelect
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
     handleDateSelect: function(info) {
      alert('selected ' + info.startStr + ' to ' + info.endStr);
    }
  }
}
</script>
<template>
  <button @click="toggleWeekends">toggle weekends</button>
  <FullCalendar :options="calendarOptions" />
</template>