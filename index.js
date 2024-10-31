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

document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();

  fetch("coupon.json")
    .then((response) => response.json())
    .then((data) => {
      const couponContainer = document.querySelector(".coupon-container");

      for (let couponName in data) {
        const couponData = data[couponName];

        const endDateStr = couponData.period.split("~")[1].trim();
        const endDate = new Date(endDateStr);

        if (today <= endDate) {
          const couponEl = document.createElement("div");
          couponEl.classList.add("coupon-list");

          const nameEl = document.createElement("div");
          nameEl.classList.add("coupon-name");
          nameEl.innerHTML = `<p>${couponName}</p>`;

          const periodEl = document.createElement("div");
          periodEl.classList.add("coupon-period");
          periodEl.innerHTML = `<p>${couponData.period}</p>`;

          // 구성품 확인용 텍스트 요소 생성
          const showItemsText = document.createElement("span");
          showItemsText.classList.add("show-items");
          showItemsText.textContent = "구성품 확인";

          const tooltip = document.createElement("div");
          tooltip.classList.add("tooltip-coupon");

          couponData.items.forEach((item) => {
            const [itemName, itemQty] = item.split("x");
            const sanitizedName = itemName.trim().replace(/%/g, "^");
            const imgPath = `image/item/${sanitizedName}.png`;

            const itemElement = document.createElement("div");
            itemElement.classList.add("tooltip-item");
            itemElement.style.display = "flex";
            itemElement.style.alignItems = "center";
            itemElement.style.gap = "10px";

            // 이미지와 개수를 포함한 HTML 추가
            itemElement.innerHTML = `
          <div style="position: relative; display: inline-block;">
            <img src="${imgPath}" alt="${itemName.trim()}" style="width: 45px; height: 45px; background-color: #0a0e1a; border-radius: 5px;">
            <span style="position: absolute; bottom: 5px; right: 0px; color: white; font-size: 11px; padding: 1px 3px; text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;">${
              itemQty ? itemQty.trim() : ""
            }</span>
          </div>
          <span>${itemName.trim()}</span>
        `;
            tooltip.appendChild(itemElement);
          });

          document.body.appendChild(tooltip);

          showItemsText.addEventListener("mouseover", function (event) {
            tooltip.style.display = "block";
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
          });

          showItemsText.addEventListener("mousemove", function (event) {
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
          });

          showItemsText.addEventListener("mouseout", function () {
            tooltip.style.display = "none";
          });

          const numberEl = document.createElement("div");
          numberEl.classList.add("coupon-number");
          numberEl.innerHTML = `<p>${couponData.number}</p>`;

          couponEl.appendChild(nameEl);
          couponEl.appendChild(periodEl);
          couponEl.appendChild(showItemsText);
          couponEl.appendChild(numberEl);

          couponContainer.appendChild(couponEl);

          numberEl.addEventListener("click", function () {
            navigator.clipboard
              .writeText(couponData.number)
              .then(() => alert(`쿠폰 번호가 복사되었습니다.`))
              .catch((err) => console.error("복사 실패:", err));
          });
        }
      }
    })
    .catch((error) => console.error("Error loading coupon data:", error));
});

document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const todayDay = days[today.getDay()];

  const schedule = {
    "기어 사바나": ["화요일", "목요일", "토요일"],
    "무한 산": ["수요일", "금요일", "일요일"],
    "사막 지대": ["화요일", "목요일", "토요일"],
    "어둠성 계곡": ["월요일", "금요일", "일요일"],
    "현실 세계": ["월요일", "수요일", "토요일"],
    "스파이럴 마운틴": ["월요일", "목요일", "일요일"],
  };

  const locationsToday = [];
  for (const location in schedule) {
    if (schedule[location].includes(todayDay)) {
      locationsToday.push(location);
    }
  }

  const locationDiv = document.createElement("div");
  locationDiv.classList.add("locations-today");
  locationDiv.innerHTML = `${locationsToday.join("<br>")}`;

  document.querySelector(".overflow").appendChild(locationDiv);
});