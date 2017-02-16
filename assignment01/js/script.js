const MARKING_SPEED = 10;
// setting x,y coords as global variables
var x;
var y;
var music = true;
var drawing;
const NUM_BARS = 20;
// Storing the window height in a variable
var windowHeight;

$(document).ready(function() {

  // determine the vert and horizontal position of the mouse
  $(document).mousemove(getCoords);

  // draw rectangles at the mouse position when the mouse is clicked
  $('.canvas').mousedown(draw);

  //if the mouse goes off the screen stop drawing to prevent problems when the mouse returns
  $('.canvas').mouseleave(stopDrawing);

  // stop drawing when the mouse is released
  $('.canvas').mouseup(stopDrawing);

  // a button that clears the page and speaks
  $('.clear').click(clickedClear);

  toggleMusic();

});

//get the x and y coordinates
function getCoords(event) {
  x = event.clientX;
  y = event.clientY;
  console.log("X: " + x + ", Y : " + y);

}

//make a rectangle every few milliseconds
function draw() {
  drawing = setInterval(mark, MARKING_SPEED);
}

//make its location at the mouse coordinates
function mark() {
  var rect = rectangle(x, y, 10, 10);
  //place it on the page
  $('.canvas').append(rect);
}

function rectangle (x, y, w, h) {
  // creating the div that will be the rectangle using jQuery
  var rect = $('<div class="rect"></div>'); 

  // storing properties in the rectangle object
  rect.x = x;
  rect.y = y;
  rect.w = w;
  rect.h = h;

  // Then we set up the CSS of the div so that it looks like a rectangle
  // in the location we want it.
  //
  // Using transform's translate()
  rect.css({ 
    position: 'absolute',
    width: rect.w + 'px',
    height: rect.h + 'px', 
    transform: 'translate(' + rect.x + 'px, ' + rect.y + 'px)',
    backgroundColor: 'springgreen'
  }); 

  return rect;
}

//stop the drawing interval
function stopDrawing() {
  if (drawing) {
    clearInterval(drawing);
    drawing = undefined;
  }
}


function clickedClear() {
  barAnimation();
  voice();
  clearPage();
}

//randomly selected comment (from array) spoken by a british man
function voice() {
  var comment = [
    "say goodbye",
    "let's start again",
    "another one",
    "a fresh start",
    "the blank canvas",
    "what will you make now",
    "this one will be a masterpiece"
  ]

  var randomComment = comment[Math.floor(Math.random() * comment.length)];

  responsiveVoice.speak(
    randomComment,
    "UK English Male",
    //calling the bar animation for the duration of the spoken comment
    {pitch: .5, rate: .8, onend: removeBars})
}

// a function that makes horizontal bars flash on
// the screen as the page is being cleared
function barAnimation() {
  console.log('animate!');

  //get the height of the page
  windowHeight = $(window).height();

  // First we create an array to store the bars
  bars = new Array(NUM_BARS);

  // Now we loop through the (empty) array, putting bars in it
  for (var i = 0; i < NUM_BARS; i++) {

    // Make a bar (set its height randomly so they're at different and random places in the window)
    var br = bar(0, windowHeight/i+100, 100, 2);

    // Put it in the array
    bars[i] = br;

    // Add it to the HTML
    $('body').append(bars[i]);
  }
}

function bar (x, y, w, h) {
  // creating the div that will be the bar using jQuery
  var br = $('<div class="bar"></div>'); 

  // storing properties in the bar object
  br.x = x;
  br.y = y;
  br.w = w;
  br.h = h;

  var color = ['yellowgreen', 'purple', 'lime', 'springgreen', 'yellow', 'darkseagreen'];
  var randomColor = color[Math.floor(Math.random() * color.length)];

  // Then we set up the CSS of the div so that it looks like a bar
  // in the location we want it.
  //
  // Using transform's translate()
  br.css({ 
    position: 'absolute',
    width: br.w + '%',
    height: br.h + 'px', 
    transform: 'translate(' + br.x + 'px, ' + br.y + 'px)',
    backgroundColor: randomColor
  }); 

  return br;
}

function removeBars() {
  $('.bar').remove;
}
//clearing the page lowers the opacity of what has been drawn to 0
//then it starts the css animation to fade back in over 1 minute
function clearPage() {
  $('.rect').css({
    opacity: 0,
    'animation-name': 'fadein',
    'animation-duration': '10s',
    'animation-delay': '3s',
    'animation-fill-mode': 'forwards'
  });
}

function toggleMusic() {
  //just lowering the music volume a bit because it was too loud
  //compared to the voice
  $('.music').prop('volume', 0.4);
  var song = document.getElementsByClassName("music")[0];

  $(document).keypress(function (event) {
    //pause music
    if (music == true) {
      if (event.which == 109) {
        // m
        music = false;
        song.pause();
        console.log("Music Paused");
      }
    }

    //unpause music
    else if (music == false) {
      if (event.which == 109) {
        // m
        music = true;
        song.play();
        console.log("Music UnPaused");
      }
    }
  });
}
