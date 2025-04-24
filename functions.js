var savedHours = localStorage.getItem('bankHours') ? parseFloat(localStorage.getItem('bankHours')) : 0;
var savedDayHours = JSON.parse(localStorage.getItem('savedDayHours')) || {};
var selectedDateKey = null; // Käyttäjän valitsema päivämäärä

function calculateHours() {
    if (!selectedDateKey) {
        alert("Select a day from the calendar first.");
        return;
    }

    var startingtimeInput = document.getElementById('startingtime').value;
    var endingtimeInput = document.getElementById('endingtime').value;

    var startingHours = parseFloat(startingtimeInput.split(":")[0]);
    var startingMinutes = parseFloat(startingtimeInput.split(":")[1]);

    var endingHours = parseFloat(endingtimeInput.split(":")[0]);
    var endingMinutes = parseFloat(endingtimeInput.split(":")[1]);

    var workhours = endingHours - startingHours;
    var workminutes = endingMinutes - startingMinutes;

    if (workminutes < 0) {
        workminutes += 60;
        workhours -= 1;
    }

    if (workhours > 8) {
        savedHours += workhours - 8 + workminutes / 60;
        localStorage.setItem('bankHours', savedHours.toFixed(2));
    }

    document.getElementById('hours').textContent = workhours + " Hours and " + workminutes + " minutes ";

    // Tallenna päivä
    savedDayHours[selectedDateKey] = true;
    localStorage.setItem('savedDayHours', JSON.stringify(savedDayHours));

    updateLocalStorageValues();
    renderCalendar(currentMonth, currentYear);
}

function addManually() {
    if (!selectedDateKey) {
        alert("Select a day from the calendar first.");
        return;
    }

    var hoursToAdd = parseFloat(prompt("How many hours you want to add manually?"));

    if (!isNaN(hoursToAdd) && hoursToAdd > 0) {
        savedHours += hoursToAdd;
        localStorage.setItem('bankHours', savedHours.toFixed(2));
        alert("You added " + hoursToAdd + " hours to bank.");

        savedDayHours[selectedDateKey] = true;
        localStorage.setItem('savedDayHours', JSON.stringify(savedDayHours));

        updateLocalStorageValues();
        renderCalendar(currentMonth, currentYear);
    }
}

function useBankHours() {
    var usedHours = parseFloat(prompt("How many hours you want to use from bank?"));

    if (!isNaN(usedHours) && usedHours <= savedHours) {
        savedHours -= usedHours;
        localStorage.setItem('bankHours', savedHours.toFixed(2));
        alert("You used " + usedHours + " hours from bank.");
    } else {
        alert("Incorrect number of hours or you don't have enough hours in the bank.");
    }

    updateLocalStorageValues();
}

function showSavedHours() {
    alert("Hours saved in bank: " + savedHours.toFixed(2));
}

function updateLocalStorageValues() {
    document.getElementById('bankHours').textContent = savedHours.toFixed(2);
}

// === KALENTERI ===
const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function renderCalendar(month, year) {
    calendarDates.innerHTML = '';
    monthYear.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement('div');
        blank.classList.add('blank');
        calendarDates.appendChild(blank);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.textContent = i;

        let dateKey = `${year}-${month}-${i}`;
        if (savedDayHours[dateKey]) {
            day.classList.add('logged-day');
        }

        if (
            i === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            day.classList.add('current-date');
        }

        // Klikattava päivä
        day.addEventListener('click', () => {
            selectedDateKey = dateKey;
            highlightSelectedDay(day);
        });

        calendarDates.appendChild(day);
    }
}

function highlightSelectedDay(selectedElement) {
    document.querySelectorAll('.calendar-dates div').forEach(el => {
        el.classList.remove('selected-day');
    });
    selectedElement.classList.add('selected-day');
}

renderCalendar(currentMonth, currentYear);

prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});