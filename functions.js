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
