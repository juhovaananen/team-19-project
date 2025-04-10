var savedHours = localStorage.getItem('bankHours') ? parseFloat(localStorage.getItem('bankHours')) : 0;

function calculateHours() {
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
    workhours -=1;
}

if (workhours > 8) {
    savedHours += workhours - 8 + workminutes / 60;
    localStorage.setItem('bankHours', savedHours.toFixed(2)) //pyöristetään kaksi desimaalia
}

document.getElementById('hours').textContent = workhours + " Hours and " + workminutes + " minutes "; //syöttää tuloksen indexiin.

updateLocalStorageValues();

}

// Käytä pankki tunteja:
function useBankHours() {
    var usedHours = parseFloat(prompt("How many hours you want to use from bank?"));

    if (!isNaN(usedHours) && usedHours <= savedHours) {
        savedHours -= usedHours;
        localStorage.setItem('bankHours', savedHours.toFixed(2)); // Pyöristetään kaksi desimaalia
        alert("You used " + usedHours + " hours from bank.");
    } else {
        alert("Incorrect number of hours or you don't have enough hours in the bank.");
    }

    updateLocalStorageValues();
}

// Näytä pankki tunnit:
function showSavedHours() {
    alert("Hours saved in bank: " + savedHours.toFixed(2));
}

// Lisää manuaalisesti tunteja
function addManually() {
    var hoursToAdd = parseInt(prompt("How many hours you want to add manually?"));

    if (!isNaN(hoursToAdd) && hoursToAdd > 0) {
    savedHours += hoursToAdd;
    localStorage.setItem('bankHours', savedHours.toFixed(2)); // Pyöristetään kaksi desimaalia
    alert("You added " + hoursToAdd + " hours to bank.");
    }


    updateLocalStorageValues();
}

// Päivitä localstoragen arvot
function updateLocalStorageValues() {
    document.getElementById('bankHours').textContent = savedHours.toFixed(2);
}