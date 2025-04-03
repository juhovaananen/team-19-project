function calculateHours() {
var startingtimeInput = document.getElementById('startingtime').value;
var endingtimeInput = document.getElementById('endingtime').value;

var startingHours = parseFloat(startingtimeInput.split(":")[0]);
var startingMinutes = parseFloat(startingtimeInput.split(":")[1]);

var endingHours = parseFloat(endingtimeInput.split(":")[0]);
var endingMinutes = parseFloat(endingtimeInput.split(":")[1]);

var workhours = endingHours - startingHours;
var workminutes = endingMinutes - startingMinutes;

}
