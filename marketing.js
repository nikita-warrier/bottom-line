document.addEventListener("DOMContentLoaded", function () {

    const addPlatformBtn = document.getElementById("add-platform");
    const platformList = document.getElementById("platform-list");

    const addInfluencerBtn = document.getElementById("add-influencer");
    const influencerList = document.getElementById("influencer-list");


    if (!addPlatformBtn || !platformList || !addInfluencerBtn || !influencerList) {
        return;
    }


    /* =========================================
       add platform
    ========================================= */

    addPlatformBtn.addEventListener("click", function () {

        const platformCard = createPlatformCard();

        platformList.appendChild(platformCard);

        refreshInfluencerPlatforms();

        updateCounts();

    });


    /* =========================================
       add influencer
    ========================================= */

    addInfluencerBtn.addEventListener("click", function () {

        const influencerRow = createInfluencerRow();

        influencerList.appendChild(influencerRow);

        updateCounts();

    });


    /* =========================================
       create platform card
    ========================================= */

    function createPlatformCard() {

        const platformCard = document.createElement("div");

        platformCard.className = "platform-card";

        platformCard.innerHTML = `
            <div class="platform-header">

                <input
                    type="text"
                    class="platform-name"
                    placeholder="Platform Name"
                >

                <input
                    type="text"
                    class="platform-followers"
                    placeholder="Followers"
                >

            </div>

            <div class="tasks"></div>

            <button
                type="button"
                class="add-task"
            >
                + Add Task
            </button>
        `;


        const platformNameInput =
            platformCard.querySelector(".platform-name");


        platformNameInput.addEventListener(
            "input",
            refreshInfluencerPlatforms
        );


        const addTaskBtn =
            platformCard.querySelector(".add-task");


        const tasks =
            platformCard.querySelector(".tasks");


        addTaskBtn.addEventListener("click", function () {

            const task = createTask();

            tasks.appendChild(task);

            updateCounts();

        });


        return platformCard;

    }


    /* =========================================
       create task
    ========================================= */

    function createTask() {

        const task = document.createElement("div");

        task.className = "task";


        task.innerHTML = `
            <input
                type="text"
                placeholder="Task Name"
            >

            <select>

                <option>Not Started</option>

                <option>In Progress</option>

                <option>Ready to Post</option>

            </select>
        `;


        const statusSelect =
            task.querySelector("select");


        updateTaskColor(
            task,
            statusSelect.value
        );


        statusSelect.addEventListener(
            "change",
            function () {

                updateTaskColor(
                    task,
                    statusSelect.value
                );

            }
        );


        return task;

    }


    /* =========================================
       task status dot color
    ========================================= */

    function updateTaskColor(task, status) {

        const colors = {
            "Not Started": "#ffb8ca",
            "In Progress": "#fff1b8",
            "Ready to Post": "#c1fdd3"
        };


        // Remove old status classes

        task.classList.remove(
            "status-not-started",
            "status-in-progress",
            "status-ready"
        );


        // Add the correct class

        if (status === "Not Started") {

            task.classList.add(
                "status-not-started"
            );

        }

        else if (status === "In Progress") {

            task.classList.add(
                "status-in-progress"
            );

        }

        else if (status === "Ready to Post") {

            task.classList.add(
                "status-ready"
            );

        }


        // set the dot color directly

        task.style.setProperty(
            "--status-color",
            colors[status]
        );

    }


    /* =========================================
       get platform options
    ========================================= */

    function getPlatformOptions() {

        const platformInputs =
            document.querySelectorAll(
                ".platform-card .platform-name"
            );


        return Array.from(platformInputs)
            .map(input => input.value.trim())
            .filter(name => name.length > 0);

    }


    /* =========================================
       refresh platform select
    ========================================= */

    function refreshPlatformSelect(
        select,
        currentValue = ""
    ) {

        const options =
            getPlatformOptions();


        if (options.length === 0) {

            select.innerHTML =
                `<option disabled selected>No platforms</option>`;

            select.disabled = true;

            return;

        }


        select.disabled = false;


        const preserved =
            currentValue &&
            options.includes(currentValue)
                ? currentValue
                : options[0];


        select.innerHTML =
            options
                .map(platform =>
                    `<option>${platform}</option>`
                )
                .join("");


        select.value = preserved;

    }


    /* =========================================
       refresh influencer platforms
    ========================================= */

    function refreshInfluencerPlatforms() {

        const selects =
            document.querySelectorAll(
                ".influencer-platform"
            );


        selects.forEach(select => {

            refreshPlatformSelect(
                select,
                select.value
            );

        });

    }


    /* =========================================
       create influencer row
    ========================================= */

    function createInfluencerRow() {

        const row =
            document.createElement("div");


        row.className =
            "influencer-row";


        row.innerHTML = `
            <input
                type="text"
                class="influencer-name"
                placeholder="Influencer Name"
            >

            <select
                class="influencer-platform"
            ></select>

            <select
                class="influencer-status"
            >
                <option>Posted</option>
                <option>Waiting</option>
                <option>Contacted</option>
            </select>

            <button
                type="button"
                class="remove-influencer"
            >
                Delete
            </button>
        `;


        /* platform */

        const platformSelect =
            row.querySelector(
                ".influencer-platform"
            );


        refreshPlatformSelect(
            platformSelect
        );


        /* status */

        const statusSelect =
            row.querySelector(
                ".influencer-status"
            );


        updateInfluencerStatusColor(
            row,
            statusSelect.value
        );


        statusSelect.addEventListener(
            "change",
            function () {

                updateInfluencerStatusColor(
                    row,
                    statusSelect.value
                );

                updateCounts();

            }
        );


        /* delete */

        const removeBtn =
            row.querySelector(
                ".remove-influencer"
            );


        removeBtn.addEventListener(
            "click",
            function () {

                const influencerName =
                    row
                        .querySelector(
                            ".influencer-name"
                        )
                        .value
                        .trim()
                    || "this influencer";


                const confirmed =
                    confirm(
                        `Delete ${influencerName}? This cannot be undone.`
                    );


                if (confirmed) {

                    row.remove();

                    updateCounts();

                }

            }
        );


        return row;

    }


    /* =========================================
       influencer status dot color
    ========================================= */

    function updateInfluencerStatusColor(
        row,
        status
    ) {

        const colors = {
            "Posted": "#c1fdd3",
            "Waiting": "#fff1b8",
            "Contacted": "#ffb8ca"
        };


        // Remove old status classes

        row.classList.remove(
            "influencer-posted",
            "influencer-waiting",
            "influencer-contacted"
        );


        // Add the correct class

        if (status === "Posted") {

            row.classList.add(
                "influencer-posted"
            );

        }

        else if (status === "Waiting") {

            row.classList.add(
                "influencer-waiting"
            );

        }

        else if (status === "Contacted") {

            row.classList.add(
                "influencer-contacted"
            );

        }


        // set dot color

        row.style.setProperty(
            "--status-color",
            colors[status]
        );

    }


    /* =========================================
       update counts
    ========================================= */

    function updateCounts() {

        const platformCount =
            document.querySelectorAll(
                ".platform-card"
            ).length;


        const platformCountElement =
            document.getElementById(
                "platform-count"
            );


        if (platformCountElement) {

            platformCountElement.textContent =
                platformCount;

        }


        const taskCount =
            document.querySelectorAll(
                ".task"
            ).length;


        const taskCountElement =
            document.getElementById(
                "task-count"
            );


        if (taskCountElement) {

            taskCountElement.textContent =
                taskCount;

        }


        const influencerCount =
            document.querySelectorAll(
                ".influencer-row"
            ).length;


        const influencerCountElement =
            document.getElementById(
                "influencer-count"
            );


        if (influencerCountElement) {

            influencerCountElement.textContent =
                influencerCount;

        }


        const postedCount =
            Array.from(
                document.querySelectorAll(
                    ".influencer-row"
                )
            ).filter(row => {

                const statusSelect =
                    row.querySelector(
                        ".influencer-status"
                    );

                return statusSelect &&
                    statusSelect.value === "Posted";

            }).length;


        const postCountElement =
            document.getElementById(
                "post-count"
            );


        if (postCountElement) {

            postCountElement.textContent =
                postedCount;

        }

    }

});