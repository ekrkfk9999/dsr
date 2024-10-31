document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var tooltipEl = document.getElementById("tooltip");
  calendarEl.style.width = "55%";
  calendarEl.style.margin = "0 auto";

  var calendar = new FullCalendar.Calendar(calendarEl, {
    locale: "ko",
    contentHeight: "auto",
    aspectRatio: 1,
    initialView: "dayGridMonth",
    dayMaxEventRows: 5,
    headerToolbar: {
      left: "currentMonth",
      center: "customText",
      right: "prev,next",
    },
    customButtons: {
      currentMonth: {
        text: "",
        click: function () {},
      },
      customText: {
        text: "디지몬 슈퍼럼블 일정",
        click: function () {},
      },
    },
    dayCellContent: function (info) {
      return { html: `<span>${info.date.getDate()}</span>` };
    },
    events: [
      {
        title: "디지패스 2024 시즌11",
        start: "2024-10-24",
        end: "2024-11-21",
        backgroundColor: "gray",
      },
      {
        title: "폭주한 펌프몬 할로윈 이벤트",
        start: "2024-10-24",
        end: "2024-11-21",
        backgroundColor: "#ffcccc",
        textColor: "#990000",
      },
      {
        title: "오메가몬 출시 이벤트",
        start: "2024-10-24",
        end: "2024-11-21",
      },
      {
        title: "2.51 업데이트",
        start: "2024-11-07",
        backgroundColor: "green",
        textColor: "white",
      },
    ],
    datesSet: function (info) {
      const currentMonthText = info.view.currentStart.toLocaleString("ko", {
        month: "long",
        year: "numeric",
      });
      document.querySelector(".fc-currentMonth-button").innerHTML =
        currentMonthText;
    },

    eventDidMount: function (info) {
      const startDate = info.event.start.toLocaleDateString();
      const endDate = info.event.end
        ? info.event.end.toLocaleDateString()
        : startDate;
      const tooltipText = `${info.event.title}<br>${startDate} ~ ${endDate}`;

      info.el.addEventListener("mouseover", function () {
        tooltipEl.style.display = "block";
        tooltipEl.innerHTML = tooltipText;
      });

      info.el.addEventListener("mousemove", function (event) {
        tooltipEl.style.left = event.pageX + 10 + "px";
        tooltipEl.style.top = event.pageY + 10 + "px";
      });

      info.el.addEventListener("mouseout", function () {
        tooltipEl.style.display = "none";
      });
    },
  });

  calendar.render();
});
