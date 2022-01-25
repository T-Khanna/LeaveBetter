<script>
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { calculateTimeoff } from "../util.js";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        dateClick: this.handleDateClick,
        events: [
          { title: "Martina OOTO", date: "2022-01-27" },
          { title: "Tanmay OOTO", date: "2022-01-31" },
        ],
        eventColor: '#00bd7e',
        weekends: true, // show weekends but don't count them as vacation time
        firstDay: 1,
        editable: true,
        selectable: true,
        select: this.handleDateSelect,
        timeZone: "UTC",
        selectMirror: false,
        eventClick: this.handleEventClick,
        headerToolbar: {
            left: 'today',
            center: 'title',
            right: 'prev,next'
        }
      },
    };
  },
  methods: {
    select: function (info) {
      alert("selected " + info.startStr + " to " + info.endStr);
    },

    handleDateSelect(selectInfo) {
      let title = prompt("Please enter a new title for your event");

      if (title) {
        let calendar = selectInfo.view.calendar;
        calendar.unselect(); // clear date selection

        let daysOff = calculateTimeoff(
          selectInfo.start,
          selectInfo.end,
          selectInfo.view.calendar
        );

        calendar.addEvent({
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
        });
        alert(`You have taken ${daysOff} days OOTO!`, daysOff);
      }
    },

    handleEventClick(info) {
      if (
        confirm(
          `Are you sure you want to delete the event '${info.event.title}'`
        )
      ) {
        info.event.remove();
      }
    },
  },
};
</script>
<template>
  <FullCalendar :options="calendarOptions" />
</template>