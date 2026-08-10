const form = document.getElementById('timeline-form');
const dateInput = document.getElementById('timeline-date');
const eventInput = document.getElementById('timeline-event');
const timelineList = document.getElementById('timeline-list');
const timelineToggle = document.getElementById('timeline-toggle');
const brandingInput = document.getElementById('branding-image-input');
const brandingAvatar = document.getElementById('branding-avatar-image');
const brandingAvatarLabel = document.querySelector('.branding-avatar__label');
const events = [];
let isExpanded = false;
const MAX_VISIBLE_ITEMS = 6;

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
