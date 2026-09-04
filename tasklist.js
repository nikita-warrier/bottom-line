var tasks = [];

document.getElementById("task-form").addEventListener("submit", function(event) {
    event.preventDefault();

    var taskName = document.getElementById("task").value;
    var description = document.getElementById("description").value;
    var dueDate = document.getElementById("due-date").value;
    var priority = document.getElementById("priority").value;

    if (taskName === '') {
        alert("You must enter a task name!");
        return;
    }

    tasks.push({
        name: taskName,
        description: description,
        dueDate: dueDate,
        priority: priority
    });

    renderTasks(); // redraw the whole list from the array

    document.getElementById("task-form").reset();
});

function renderTasks() {
    var list = document.getElementById("task-list");
    list.innerHTML = ""; // clear what's there, we're rebuilding it

    var filteredTasks = getFilteredTasks(); // we'll write this next

    filteredTasks.forEach(function(task) {
        var row = document.createElement("div");
        row.className = "task-row priority-" + task.priority;

        row.innerHTML = `
            <input type="checkbox" class="task-checkbox">
            <div class="task-info">
                <span class="task-name">${task.name}</span>
                <span class="task-description">${task.description}</span>
                <span class="task-date">${task.dueDate}</span>
            </div>
            <button class="delete-btn">×</button>
        `;

        row.querySelector(".delete-btn").addEventListener("click", function() {
            tasks = tasks.filter(t => t !== task); // remove this exact task from the array
            renderTasks(); // redraw
        });

        row.querySelector(".task-checkbox").addEventListener("change", function() {
            row.querySelector(".task-name").classList.toggle("done", this.checked);
        });

        list.appendChild(row);
    });
}

function getFilteredTasks() {
    var priorityFilter = document.getElementById("filter-priority").value;
    var dateSort = document.getElementById("sort-date").value;

    var result = tasks.filter(function(task) {
        return priorityFilter === "all" || task.priority === priorityFilter;
    });

    if (dateSort === "asc") {
        result = result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (dateSort === "desc") {
        result = result.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    return result;
}

document.getElementById("filter-priority").addEventListener("change", renderTasks);
document.getElementById("sort-date").addEventListener("change", renderTasks);