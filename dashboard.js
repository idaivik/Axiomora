const productivityData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [72, 78, 74, 88, 91, 84, 89]
};

const chartColors = {
    line: {
        borderColor: "#0071e3",
        backgroundColor: "rgba(0, 113, 227, 0.12)"
    },
    bar: {
        backgroundColor: ["#d9eaff", "#c8e0ff", "#b9d6ff", "#95c4ff", "#72b0ff", "#4f9cff", "#0071e3"]
    },
    pie: {
        backgroundColor: ["#0071e3", "#4f9cff", "#7cb6ff", "#a3ccff", "#c8e0ff", "#dcecff", "#edf5ff"]
    }
};

const taskGroups = [
    {
        title: "Daily habits",
        items: [
            { label: "Morning planning", meta: "15 minute reset", done: true },
            { label: "Deep work session", meta: "90 minutes", done: true },
            { label: "Weak topic review", meta: "Physics numericals", done: false }
        ]
    },
    {
        title: "Weekly goals",
        items: [
            { label: "Complete algebra problem set", meta: "Due Thursday", done: true },
            { label: "Finish biology recap", meta: "2 chapters left", done: false },
            { label: "Hit 18 focus hours", meta: "Current 18.5h", done: true }
        ]
    },
    {
        title: "Long-term goals",
        items: [
            { label: "Raise mock test average to 90%", meta: "Current 86%", done: false },
            { label: "Maintain 30-day streak", meta: "Day 18", done: true }
        ]
    }
];

const calendarEvents = [
    { date: "2026-03-04", type: "study", title: "Chemistry revision", time: "10:00 AM" },
    { date: "2026-03-06", type: "deadline", title: "Weekly quiz submission", time: "05:00 PM" },
    { date: "2026-03-10", type: "focus", title: "Deep focus block", time: "11:00 AM" },
    { date: "2026-03-16", type: "study", title: "Math practice session", time: "09:30 AM" },
    { date: "2026-03-16", type: "focus", title: "Streak recovery session", time: "07:00 PM" },
    { date: "2026-03-20", type: "deadline", title: "Long-term goal review", time: "04:00 PM" },
    { date: "2026-03-24", type: "study", title: "Weak topics sprint", time: "08:30 AM" },
    { date: "2026-03-28", type: "focus", title: "Mock test analysis", time: "01:00 PM" }
];

let productivityChart;
let currentChartType = "line";
let visibleMonth = new Date(2026, 2, 1);

function buildChartConfig(type) {
    const base = {
        type,
        data: {
            labels: productivityData.labels,
            datasets: [
                {
                    label: "Productivity",
                    data: productivityData.values,
                    borderWidth: 3,
                    tension: 0.35,
                    fill: type === "line",
                    borderColor: chartColors.line.borderColor,
                    backgroundColor: type === "line" ? chartColors.line.backgroundColor : chartColors.bar.backgroundColor,
                    hoverBackgroundColor: chartColors.pie.backgroundColor
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: type === "pie",
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        boxWidth: 10,
                        color: "#6b7280",
                        font: {
                            family: "Inter"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: "#111827",
                    titleFont: { family: "Inter", weight: "600" },
                    bodyFont: { family: "Inter" },
                    padding: 12,
                    displayColors: false
                }
            },
            scales: type === "pie" ? {} : {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#6b7280",
                        font: {
                            family: "Inter"
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: "#6b7280",
                        stepSize: 20,
                        font: {
                            family: "Inter"
                        }
                    },
                    grid: {
                        color: "rgba(107, 114, 128, 0.12)"
                    }
                }
            }
        }
    };

    if (type === "bar") {
        base.data.datasets[0].borderRadius = 12;
        base.data.datasets[0].borderSkipped = false;
    }

    if (type === "pie") {
        base.data.datasets[0].backgroundColor = chartColors.pie.backgroundColor;
        base.data.datasets[0].borderWidth = 0;
    }

    return base;
}

function renderChart(type) {
    const chartCanvas = document.getElementById("productivityChart");
    if (!chartCanvas) {
        return;
    }

    if (productivityChart) {
        productivityChart.destroy();
    }

    productivityChart = new Chart(chartCanvas, buildChartConfig(type));
}

function renderTasks() {
    const container = document.getElementById("taskGroups");
    if (!container) {
        return;
    }

    container.innerHTML = taskGroups.map((group, groupIndex) => `
        <section class="task-group">
            <div class="task-group-header">
                <h3>${group.title}</h3>
                <span>${group.items.filter((item) => item.done).length}/${group.items.length} complete</span>
            </div>
            <div class="task-list">
                ${group.items.map((item, itemIndex) => `
                    <label class="task-item ${item.done ? "completed" : ""}">
                        <input
                            type="checkbox"
                            data-group-index="${groupIndex}"
                            data-item-index="${itemIndex}"
                            ${item.done ? "checked" : ""}
                        >
                        <div>
                            <strong>${item.label}</strong>
                            <span>${item.meta}</span>
                        </div>
                        <span class="task-pill">${group.title}</span>
                    </label>
                `).join("")}
            </div>
        </section>
    `).join("");

    bindTaskInputs();
    updateTaskProgress();
}

function bindTaskInputs() {
    document.querySelectorAll(".task-item input").forEach((input) => {
        input.addEventListener("change", (event) => {
            const groupIndex = Number(event.target.dataset.groupIndex);
            const itemIndex = Number(event.target.dataset.itemIndex);
            taskGroups[groupIndex].items[itemIndex].done = event.target.checked;
            renderTasks();
        });
    });
}

function updateTaskProgress() {
    const allItems = taskGroups.flatMap((group) => group.items);
    const completed = allItems.filter((item) => item.done).length;
    const percent = Math.round((completed / allItems.length) * 100);

    document.getElementById("taskProgressValue").textContent = `${percent}%`;
    document.getElementById("taskProgressBar").style.width = `${percent}%`;
}

function getMonthMatrix(date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDay = (start.getDay() + 6) % 7;
    const totalCells = Math.ceil((startDay + end.getDate()) / 7) * 7;
    const days = [];

    for (let i = 0; i < totalCells; i += 1) {
        const dayDate = new Date(start);
        dayDate.setDate(i - startDay + 1);
        days.push(dayDate);
    }

    return days;
}

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    const label = document.getElementById("calendarMonthLabel");
    const eventsBox = document.getElementById("calendarEvents");
    if (!grid || !label || !eventsBox) {
        return;
    }

    label.textContent = visibleMonth.toLocaleString("en-US", { month: "long", year: "numeric" });
    const todayKey = "2026-03-16";
    const days = getMonthMatrix(visibleMonth);

    grid.innerHTML = days.map((day) => {
        const key = formatDateKey(day);
        const dayEvents = calendarEvents.filter((event) => event.date === key);
        const markers = dayEvents.map((event) => `<span class="dot-${event.type}"></span>`).join("");
        const classes = [
            "calendar-day",
            day.getMonth() !== visibleMonth.getMonth() ? "is-other-month" : "",
            key === todayKey ? "is-today" : ""
        ].filter(Boolean).join(" ");

        return `
            <div class="${classes}">
                <div class="calendar-day-head">
                    <span>${day.getDate()}</span>
                    <div class="calendar-markers">${markers}</div>
                </div>
            </div>
        `;
    }).join("");

    const monthEvents = calendarEvents
        .filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate.getMonth() === visibleMonth.getMonth() && eventDate.getFullYear() === visibleMonth.getFullYear();
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    eventsBox.innerHTML = monthEvents.map((event) => `
        <div class="calendar-event">
            <i class="dot dot-${event.type}"></i>
            <div>
                <strong>${event.title}</strong>
                <p>${new Date(event.date).toLocaleString("en-US", { month: "short", day: "numeric" })} · ${event.time}</p>
            </div>
        </div>
    `).join("");
}

function bindCalendarControls() {
    document.getElementById("prevMonth").addEventListener("click", () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
        renderCalendar();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
        renderCalendar();
    });
}

function bindChartSwitcher() {
    document.querySelectorAll(".chart-toggle").forEach((button) => {
        button.addEventListener("click", () => {
            const type = button.dataset.chartType;
            if (type === currentChartType) {
                return;
            }

            currentChartType = type;
            document.querySelectorAll(".chart-toggle").forEach((toggle) => {
                toggle.classList.toggle("active", toggle === button);
            });
            renderChart(type);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderChart(currentChartType);
    renderTasks();
    renderCalendar();
    bindChartSwitcher();
    bindCalendarControls();
});
