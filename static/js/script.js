document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const monthName = document.getElementById("month-name");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    const taskForm = document.getElementById("task-form");
    const completedTasksList = document.getElementById("completed-tasks");

    let tasks = [];
    let currentDate = new Date();

    const renderCalendar = () => {
        calendar.innerHTML = "";
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        monthName.textContent = `${currentDate.toLocaleString("default", { month: "long" })} ${year}`;

        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        daysOfWeek.forEach((day) => {
            const dayCell = document.createElement("div");
            dayCell.textContent = day;
            dayCell.style.fontWeight = "bold";
            calendar.appendChild(dayCell);
        });

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            calendar.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("div");
            dayCell.textContent = day;

            const taskForTheDay = tasks.filter(
                (task) => task.date === `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
            );

            if (taskForTheDay.length) {
                taskForTheDay.forEach((task) => {
                    const taskIndicator = document.createElement("div");
                    taskIndicator.textContent = task.title;
                    taskIndicator.className = task.completed ? "completed" : "scheduled";
                    dayCell.appendChild(taskIndicator);
                });
            }

            calendar.appendChild(dayCell);
        }
    };

    const renderTasks = () => {
        completedTasksList.innerHTML = "";
        tasks.forEach((task, index) => {
            const taskItem = document.createElement("li");
            taskItem.textContent = `${task.title} - ${task.date} - ${task.completed ? "Completed" : "Pending"}`;
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = () => {
                tasks.splice(index, 1);
                renderTasks();
                renderCalendar();
            };
            taskItem.appendChild(deleteBtn);
            completedTasksList.appendChild(taskItem);
        });
    };

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("task-title").value;
        const date = document.getElementById("task-date").value;
        const completed = document.getElementById("task-completed").value === "true";
        tasks.push({ title, date, completed });
        renderCalendar();
        renderTasks();
        taskForm.reset();
    });

    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});
