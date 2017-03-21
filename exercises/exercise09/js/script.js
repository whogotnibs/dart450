/*

The Crazy Dance Party
Thomas Bell

Chooses random words from local JSON data to fill out a sentence
describing a scene at a crazy dance party. Places a new sentance every second.

The placement of each sentance on the page is random just like the content

*/
var character;
var dancemove;

$(document).ready(function() {

//place a new sentance every second
setInterval(placeText, 1000);

});

function placeText () {
  //load data from the JSON file and run gotData when it's ready
  $.getJSON('data/data.json', gotData);
}

function gotData (data) {
  //randomly select a character from the JSON
  character = getRandomElement(data.character);

  //and a dance move
  dancemove = getRandomElement(data.dancemove);

  //generate a sentance using the random data from JSON
  var txt = $("<p class='txt'>" + character + " is doing the " + dancemove + " and it's crazy. </p>");

  //randomly select a location and rotation for the text on the page
  var txtX = randomIntegerInRange(0, 100);
  var txtY = randomIntegerInRange(0, 100);
  var txtRotation = randomIntegerInRange(-30, 30);

  //use css to apply the random placement
  txt.css({
    top: txtY + '%',
    left: txtX + '%',
    "transform": "rotateZ(" + txtRotation + "deg)"
  });

  //place the sentance on the page;
  $('body').append(txt);
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomIntegerInRange(min,max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
