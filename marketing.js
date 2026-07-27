document.addEventListener("DOMContentLoaded", function () {
    const addPlatformBtn = document.getElementById("add-platform");
    const platformList = document.getElementById("platform-list");

    if (!addPlatformBtn || !platformList) {
        return;
    }

    addPlatformBtn.addEventListener("click", function () {
        const platformCard = createPlatformCard();
        platformList.appendChild(platformCard);
    });

    function createPlatformCard() {
        const platformCard = document.createElement("div");
        platformCard.className = "platform-card";

        platformCard.innerHTML = `
            <div class="platform-header">
                <input type="text" placeholder="Platform Name">
                <input type="text" placeholder="Followers">
            </div>
            <div class="tasks"></div>
            <button class="add-task">+ Add Task</button>
        `;

        const addTaskBtn = platformCard.querySelector(".add-task");
        const tasks = platformCard.querySelector(".tasks");

        addTaskBtn.addEventListener("click", function () {
            const task = createTask();
            tasks.appendChild(task);
        });

        return platformCard;
    }

    function createTask() {
        const task = document.createElement("div");
        task.className = "task";

        task.innerHTML = `
            <input type="text" placeholder="Task Name">
            <select>
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Ready to Post</option>
            </select>
        `;

        const statusSelect = task.querySelector("select");
        updateTaskColor(task, statusSelect.value);

        statusSelect.addEventListener("change", function () {
            updateTaskColor(task, statusSelect.value);
        });

        return task;
    }

    function updateTaskColor(task, status) {
        const colors = {
            "Not Started": "#ffb8ca",
            "In Progress": "#fff1b8",
            "Ready to Post": "#c1fdd3"
        };
        task.style.backgroundColor = colors[status] || "transparent";
    }
});