const addPlatformBtn = document.getElementById("add-platform");
const platformList = document.getElementById("platform-list");

addPlatformBtn.addEventListener("click", function () {

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

    platformList.appendChild(platformCard);

    const addTaskBtn = platformCard.querySelector(".add-task");
    const tasks = platformCard.querySelector(".tasks");

    addTaskBtn.addEventListener("click", function () {

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

        tasks.appendChild(task);

    });

});