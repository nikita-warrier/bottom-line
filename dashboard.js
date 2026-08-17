const form = document.getElementById('timeline-form');
const dateInput = document.getElementById('timeline-date');
const eventInput = document.getElementById('timeline-event');
const timelineList = document.getElementById('timeline-list');
const timelineToggle = document.getElementById('timeline-toggle');
const brandingInput = document.getElementById('branding-image-input');
const brandingAvatar = document.getElementById('branding-avatar-image');
const brandingAvatarLabel = document.querySelector('.branding-avatar__label');
const checklistForm = document.getElementById('checklist-form');
const checklistInput = document.getElementById('checklist-input');
const checklistList = document.getElementById('checklist-list');
const checklistCount = document.getElementById('checklist-count');
const addPlatformButton = document.getElementById('add-platform-btn');
const platformGrid = document.getElementById('platform-grid');
const events = [];
let isExpanded = false;
const MAX_VISIBLE_ITEMS = 6;

const checklistStatusLabels = {
    todo: 'Need to do',
    'in-progress': 'In progress',
    completed: 'Completed'
};

let checklistItems = [];
let draggedItemId = null;

const socialPlatforms = [
    { name: 'Instagram', handle: '', posts: '', followers: '' },
    { name: 'TikTok', handle: '', posts: '', followers: '' },
    { name: 'Facebook', handle: '', posts: '', followers: '' }
];

function parseDate(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(value) {
    if (!value) return '';

    const parsedDate = parseDate(value);
    return parsedDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getSpacingPx(currentDate, previousDate) {
    if (!previousDate) return 0;

    const dayDifference = Math.round((currentDate - previousDate) / 86400000);
    if (dayDifference <= 0) return 18;

    return Math.max(18, Math.min(140, dayDifference * 1.8));
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (character) {
        const htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return htmlEntities[character] || character;
    });
}

function formatPlatformHandle(value) {
    const cleanedValue = String(value || '').trim();
    if (!cleanedValue) {
        return '—';
    }

    return cleanedValue.startsWith('@') ? cleanedValue : `@${cleanedValue}`;
}

function renderPlatformCards() {
    platformGrid.innerHTML = '';

    socialPlatforms.forEach((platform) => {
        const card = document.createElement('article');
        card.className = 'platform-card';
        card.dataset.platform = platform.name.toLowerCase();

        card.innerHTML = `
            <div class="platform-card-header">
                <h4 class="platform-name">${escapeHtml(platform.name)}</h4>
            </div>

            <div class="platform-info">
                <div class="platform-detail">
                    <span class="platform-detail-label">Handle</span>
                    <span class="platform-detail-value">${escapeHtml(formatPlatformHandle(platform.handle))}</span>
                </div>

                <div class="platform-stats">
                    <div class="platform-stat">
                        <span class="platform-stat-label">Followers</span>
                        <span class="platform-stat-value">${escapeHtml(platform.followers || '—')}</span>
                    </div>
                    <div class="platform-stat">
                        <span class="platform-stat-label">Posts</span>
                        <span class="platform-stat-value">${escapeHtml(platform.posts || '—')}</span>
                    </div>
                </div>
            </div>
        `;

        platformGrid.appendChild(card);
    });
}

function renderTimeline() {
    const sortedEvents = [...events].sort((first, second) => first.timestamp - second.timestamp);

    timelineList.innerHTML = '';

    sortedEvents.forEach((event, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'timeline-item';
        listItem.style.marginTop = index === 0 ? '0px' : `${getSpacingPx(event.timestamp, sortedEvents[index - 1].timestamp)}px`;
        listItem.innerHTML = `<strong>${event.label}</strong><span>${event.text}</span>`;
        timelineList.appendChild(listItem);
    });

    const shouldCollapse = sortedEvents.length > MAX_VISIBLE_ITEMS;
    timelineToggle.hidden = !shouldCollapse;
    timelineToggle.textContent = isExpanded ? 'See less' : 'See more';
    timelineList.classList.toggle('is-expanded', isExpanded && shouldCollapse);
}

function renderChecklist() {
    checklistList.innerHTML = '';

    if (!checklistItems.length) {
        const emptyState = document.createElement('li');
        emptyState.className = 'checklist-empty';
        emptyState.textContent = 'No tasks yet. Add your first checklist item.';
        checklistList.appendChild(emptyState);
        checklistCount.textContent = '0 items';
        return;
    }

    checklistItems.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.className = 'checklist-item';
        listItem.dataset.id = String(item.id);
        listItem.dataset.status = item.status;
        listItem.draggable = true;

        const statusOptions = Object.entries(checklistStatusLabels)
            .map(([value, label]) => `<option value="${value}" ${value === item.status ? 'selected' : ''}>${label}</option>`)
            .join('');

        listItem.innerHTML = `
            <div class="checklist-main">
                <button type="button" class="checklist-check" aria-label="Toggle checklist item ${escapeHtml(item.text)}" title="Cycle status">${item.status === 'completed' ? '✓' : '○'}</button>
                <span class="checklist-text">${escapeHtml(item.text)}</span>
            </div>
            <div class="checklist-actions">
                <select class="checklist-status" aria-label="Change status for ${escapeHtml(item.text)}">
                    ${statusOptions}
                </select>
                <button type="button" class="checklist-delete" aria-label="Delete checklist item ${escapeHtml(item.text)}">Delete</button>
            </div>
        `;

        checklistList.appendChild(listItem);
    });

    checklistCount.textContent = `${checklistItems.length} item${checklistItems.length === 1 ? '' : 's'}`;
}

function updateChecklistItemStatus(itemId, nextStatus) {
    checklistItems = checklistItems.map((item) => {
        if (item.id === itemId) {
            return { ...item, status: nextStatus };
        }
        return item;
    });

    renderChecklist();
}

function cycleChecklistStatus(itemId) {
    const currentItem = checklistItems.find((item) => item.id === itemId);
    if (!currentItem) return;

    const statusOrder = ['todo', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentItem.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    updateChecklistItemStatus(itemId, nextStatus);
}

function removeChecklistItem(itemId) {
    checklistItems = checklistItems.filter((item) => item.id !== itemId);
    renderChecklist();
}

function reorderChecklistItems(fromId, toId) {
    const fromIndex = checklistItems.findIndex((item) => item.id === fromId);
    const toIndex = checklistItems.findIndex((item) => item.id === toId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return;
    }

    const [movedItem] = checklistItems.splice(fromIndex, 1);
    checklistItems.splice(toIndex, 0, movedItem);
    renderChecklist();
}

timelineToggle.addEventListener('click', function () {
    isExpanded = !isExpanded;
    renderTimeline();
});

brandingInput.addEventListener('change', function () {
    const file = brandingInput.files[0];
    if (!file || !file.type.startsWith('image/')) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        brandingAvatar.style.backgroundImage = `url(${reader.result})`;
        brandingAvatar.classList.add('has-image');
        brandingAvatarLabel.textContent = 'Change image';
    };
    reader.readAsDataURL(file);
});

addPlatformButton.addEventListener('click', function () {
    const platformName = window.prompt('Enter a social media platform name', 'YouTube');
    if (!platformName) {
        return;
    }

    const cleanedName = platformName.trim();
    if (!cleanedName) {
        return;
    }

    const exists = socialPlatforms.some((platform) => platform.name.toLowerCase() === cleanedName.toLowerCase());
    if (exists) {
        return;
    }

    socialPlatforms.push({
        name: cleanedName,
        handle: '',
        posts: 0,
        followers: '0',
        following: 0
    });

    renderPlatformCards();
});

checklistForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const taskText = checklistInput.value.trim();
    if (!taskText) {
        return;
    }

    checklistItems.push({
        id: Date.now(),
        text: taskText,
        status: 'todo'
    });

    checklistForm.reset();
    checklistInput.focus();
    renderChecklist();
});

checklistList.addEventListener('click', function (event) {
    const deleteButton = event.target.closest('.checklist-delete');
    if (deleteButton) {
        const itemElement = deleteButton.closest('.checklist-item');
        if (itemElement) {
            removeChecklistItem(Number(itemElement.dataset.id));
        }
        return;
    }

    const toggleButton = event.target.closest('.checklist-check');
    if (toggleButton) {
        const itemElement = toggleButton.closest('.checklist-item');
        if (itemElement) {
            cycleChecklistStatus(Number(itemElement.dataset.id));
        }
    }
});

checklistList.addEventListener('change', function (event) {
    const statusSelector = event.target.closest('.checklist-status');
    if (!statusSelector) {
        return;
    }

    const itemElement = statusSelector.closest('.checklist-item');
    if (!itemElement) {
        return;
    }

    updateChecklistItemStatus(Number(itemElement.dataset.id), statusSelector.value);
});

checklistList.addEventListener('dragstart', function (event) {
    const itemElement = event.target.closest('.checklist-item');
    if (!itemElement) {
        return;
    }

    draggedItemId = Number(itemElement.dataset.id);
    itemElement.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(draggedItemId));
});

checklistList.addEventListener('dragover', function (event) {
    const itemElement = event.target.closest('.checklist-item');
    if (!itemElement) {
        return;
    }

    event.preventDefault();
    checklistList.querySelectorAll('.checklist-item').forEach((node) => node.classList.remove('drop-target'));
    itemElement.classList.add('drop-target');
});

checklistList.addEventListener('drop', function (event) {
    const itemElement = event.target.closest('.checklist-item');
    if (!itemElement || draggedItemId === null) {
        return;
    }

    event.preventDefault();
    const targetId = Number(itemElement.dataset.id);
    reorderChecklistItems(draggedItemId, targetId);
    draggedItemId = null;
    checklistList.querySelectorAll('.checklist-item').forEach((node) => node.classList.remove('drop-target'));
});

checklistList.addEventListener('dragend', function (event) {
    const itemElement = event.target.closest('.checklist-item');
    if (itemElement) {
        itemElement.classList.remove('dragging');
    }
    checklistList.querySelectorAll('.checklist-item').forEach((node) => node.classList.remove('drop-target'));
    draggedItemId = null;
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const dateValue = dateInput.value;
    const eventValue = eventInput.value.trim();

    if (!dateValue || !eventValue) {
        return;
    }

    events.push({
        timestamp: parseDate(dateValue).getTime(),
        label: formatDate(dateValue),
        text: eventValue
    });

    renderTimeline();
    form.reset();
    dateInput.focus();
});

renderPlatformCards();
renderTimeline();
renderChecklist();
