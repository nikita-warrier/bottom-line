document.addEventListener("DOMContentLoaded", function () {
    const addPlatformBtn = document.getElementById("add-platform");
    const platformList = document.getElementById("platform-list");
    const addInfluencerBtn = document.getElementById("add-influencer");
    const influencerList = document.getElementById("influencer-list");

    if (!addPlatformBtn || !platformList || !addInfluencerBtn || !influencerList) {
        return;
    }

    addPlatformBtn.addEventListener("click", function () {
        const platformCard = createPlatformCard();
        platformList.appendChild(platformCard);
        refreshInfluencerPlatforms();
    });

    addInfluencerBtn.addEventListener("click", function () {
        const influencerRow = createInfluencerRow();
        influencerList.appendChild(influencerRow);
    });

    function createPlatformCard() {
        const platformCard = document.createElement("div");
        platformCard.className = "platform-card";

        platformCard.innerHTML = `
            <div class="platform-header">
                <input type="text" class="platform-name" placeholder="Platform Name">
                <input type="text" class="platform-followers" placeholder="Followers">
            </div>
            <div class="tasks"></div>
            <button class="add-task">+ Add Task</button>
        `;

        const platformNameInput = platformCard.querySelector(".platform-name");
        platformNameInput.addEventListener("input", refreshInfluencerPlatforms);

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

    function getPlatformOptions() {
        const platformInputs = document.querySelectorAll(".platform-card .platform-name");
        return Array.from(platformInputs)
            .map(input => input.value.trim())
            .filter(name => name.length > 0);
    }

    function refreshPlatformSelect(select, currentValue = "") {
        const options = getPlatformOptions();

        if (options.length === 0) {
            select.innerHTML = `<option disabled selected>No platforms</option>`;
            select.disabled = true;
            return;
        }

        select.disabled = false;
        const preserved = currentValue && options.includes(currentValue) ? currentValue : options[0];
        select.innerHTML = options.map(platform => `<option>${platform}</option>`).join("");
        select.value = preserved;
    }

    function refreshInfluencerPlatforms() {
        const selects = document.querySelectorAll(".influencer-platform");
        selects.forEach(select => refreshPlatformSelect(select, select.value));
    }

    function createInfluencerRow() {
        const row = document.createElement("div");
        row.className = "influencer-row";

        row.innerHTML = `
            <input type="text" class="influencer-name" placeholder="Influencer Name">
            <select class="influencer-platform"></select>
            <select class="influencer-status">
                <option>Posted</option>
                <option>Waiting</option>
                <option>Contacted</option>
            </select>
            <button type="button" class="remove-influencer">Delete</button>
        `;

        const platformSelect = row.querySelector(".influencer-platform");
        refreshPlatformSelect(platformSelect);

        const statusSelect = row.querySelector(".influencer-status");
        updateInfluencerStatusColor(row, statusSelect.value);
        statusSelect.addEventListener("change", function () {
            updateInfluencerStatusColor(row, statusSelect.value);
        });

        const removeBtn = row.querySelector(".remove-influencer");
        removeBtn.addEventListener("click", function () {
            const influencerName = row.querySelector(".influencer-name").value.trim() || "this influencer";
            const confirmed = confirm(`Delete ${influencerName}? This cannot be undone.`);
            if (confirmed) {
                row.remove();
            }
        });

        return row;
    }

    function updateInfluencerStatusColor(row, status) {
        const colors = {
            Posted: "#c1fdd3",
            Waiting: "#fff1b8",
            Contacted: "#ffb8ca"
        };

        row.style.backgroundColor = colors[status] || "transparent";
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