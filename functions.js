// Haetaan pankkitunnit ja päivämäärät
var savedHours = localStorage.getItem('bankHours') ? parseFloat(localStorage.getItem('bankHours')) : 0;
var savedDayHours = JSON.parse(localStorage.getItem('savedDayHours')) || {};

// Valittu päivä
var selectedDateKey = null;

// Laskee ja tallentaa työajan
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

    // Tallennetaan päivälle tunnit
    if (!savedDayHours[selectedDateKey]) {
        savedDayHours[selectedDateKey] = { hours: 0 };
    }

    savedDayHours[selectedDateKey].hours += workhours + (workminutes / 60);
    localStorage.setItem('savedDayHours', JSON.stringify(savedDayHours));

    document.getElementById('hours').textContent = workhours + " Hours and " + workminutes + " minutes ";

    updateLocalStorageValues();
    renderCalendar(currentMonth, currentYear);
}

// Tuntien lisäys manuaalisesti
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

        // Tallennetaan päivälle manuaaliset tunnit
        if (!savedDayHours[selectedDateKey]) {
            savedDayHours[selectedDateKey] = { hours: 0 };
        }

        savedDayHours[selectedDateKey].hours += hoursToAdd;
        localStorage.setItem('savedDayHours', JSON.stringify(savedDayHours));

        updateLocalStorageValues();
        renderCalendar(currentMonth, currentYear);
    }
}

// Pankkituntien käyttäminen
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

// Näytä pankkitunnit
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

// Renderöidään kalenteri
function renderCalendar(month, year) {
  calendarDates.innerHTML = '';
  monthYear.textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Tyhjät laatikot kuun alkuun
  for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('div');
      blank.classList.add('blank');
      calendarDates.appendChild(blank);
  }

  // Renderöi päivät
  for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement('div');
      const dateNumber = document.createElement('span');
      dateNumber.classList.add('day-number');
      dateNumber.textContent = i;
      day.appendChild(dateNumber);

      let dateKey = `${year}-${month}-${i}`;

      // Näyttää päivät, joille on tallennettu tunteja
      if (savedDayHours[dateKey]) {
          day.classList.add('logged-day');
      }

      // Korostetaan nykyinen päivä
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
          showLoggedHours(day, dateKey);
      });

      // Näyttää tunnit, kun hiiri on päivän päällä
      day.addEventListener('mouseenter', () => {
          if (savedDayHours[dateKey]) {
              showLoggedHours(day, dateKey);
          }
      });

      calendarDates.appendChild(day);
  }
}

// Näyttää päivälle tallennetut tunnit
function showLoggedHours(day, dateKey) {
  const previousLabel = day.querySelector('.hours-label');
  if (previousLabel) {
      previousLabel.remove();
  }

  if (savedDayHours[dateKey] && savedDayHours[dateKey].hours > 0) {
      let hours = savedDayHours[dateKey].hours;
      const label = document.createElement('span');
      label.classList.add('hours-label');
      label.textContent = `${hours.toFixed(1)} hrs`;
      day.appendChild(label);
  }
}

// Korostaa valitun päivän
function highlightSelectedDay(day) {
  const allDays = document.querySelectorAll('.calendar-dates div');
  allDays.forEach(d => d.classList.remove('selected-day'));
  day.classList.add('selected-day');
}

renderCalendar(currentMonth, currentYear);

//kuukauden vaihto
prevMonthBtn.addEventListener('click', () => {
  currentMonth -= 1;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  }
  renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener('click', () => {
  currentMonth += 1;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  renderCalendar(currentMonth, currentYear);
});
