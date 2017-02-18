// the interval for how often a mark is made
const MARKING_SPEED = 10;
// setting x,y coords as global variables
var x;
var y;
// site loads with music not playing
var music = false;
var drawing;
const NUM_BARS = 80;

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

  // pause/play music
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
  // - 5px the x and y location to adjust for the size of the rectangle
  var rect = rectangle(x-5, y-5, 10, 10);
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

//if the user releases the mouse, stop the drawing interval if it is running 
function stopDrawing() {
  if (drawing) {
    clearInterval(drawing);
    drawing = undefined;
  }
}


//handle the clear button being clicked
function clickedClear() {
  barAnimation();
  voice();
  clearPage();
}

function voice() {
  //an array of possible comments
  var comment = [
    "say goodbye",
    "let's start again",
    "another one",
    "a fresh start",
    "a blank canvas",
    "what will you make now",
    "this one will be a masterpiece"
  ]

  //randomly select a comment using the math library
  var randomComment = comment[Math.floor(Math.random() * comment.length)];

  responsiveVoice.speak(
    randomComment,
    "UK English Male",
    //stoping the bar animation with 'removeBars' at the end of the comment
    {pitch: .5, rate: .8, onend: removeBars})
}

// a function that makes horizontal bars flash on
// the screen as the page is being cleared
function barAnimation() {
  console.log('animate!');

  // First we create an array to store the bars
  bars = new Array(NUM_BARS);

  // Now we loop through the (empty) array, putting bars in it
  for (var i = 0; i < NUM_BARS; i++) {

    // Make a bar (we will adjust the height randomly for each bar in the css)
    var br = bar(0, 0, 100, 3);

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

  //rondomly selecting 1 of 3 colours
  var color = ['springgreen', 'yellow', 'darkseagreen'];
  var randomColor = color[Math.floor(Math.random() * color.length)];


  //get the height of the page
  var windowHeight = $(window).height();
  //get a random height in the window
  var randomHeight = randomIntegerInRange(0, windowHeight)


  // Then we set up the CSS of the div so that it looks like a bar
  // in the location we want it.
  //
  // Using transform's translate()
  br.css({ 
    position: 'absolute',
    width: br.w + '%',
    height: br.h + 'px', 
    //the height of the bar is randomly selected within the height of the window
    transform: 'translate(' + br.x + 'px, ' + randomHeight + 'px)',
    backgroundColor: randomColor,
    opacity: 0,
    //animating the bars to 'flash' using css animation
    'animation-name': 'flash',
    'animation-duration': '.3s',
    'animation-delay': '1s',
    'animation-iteration-count': '2'
  }); 

  return br;
}

function removeBars() {
  //remove the bars
  $('.bar').remove();
}
//lowering the opacity of what has been drawn over 5seconds with a css animation
function clearPage() {
  $('.rect').css({
    'animation-name': 'fade',
    'animation-duration': '5s',
    'animation-fill-mode': 'forwards',
    'animation-delay': '1s'
  });
}

function toggleMusic() {
  //lowering the music volume a bit because it was too loud
  //compared to the responsiveVoice comments
  $('.music').prop('volume', 0.6);
  var song = document.getElementsByClassName("music")[0];

  //press m to play/pause the music
  $(document).keypress(function (event) {
    //play music
    if (music == false) {
      if (event.which == 109) {
        // m
        music = true;
        song.play();
        console.log("Music Played");
      }
    }
    //pause music
    else if (music == true) {
      if (event.which == 109) {
        // m
        music = false;
        song.pause();
        console.log("Music Paused");
      }
    }
  });
}

function randomIntegerInRange(min,max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
