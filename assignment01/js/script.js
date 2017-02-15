const MARKING_SPEED = 200;
var x;
var y;

$(document).ready(function() {

  // determine the vert and horizontal position of the mouse
  $(document).mousemove(getCoords);

  // draw when the mouse is clicked
  $(document).mousedown(draw);

  $(document).mouseup(stopDrawing);

  $('.clear').click(clickedClear);

});

function getCoords(event) {
  var x = event.clientX;
  var y = event.clientY;
  console.log("X: " + x + ", Y : " + y);
  return x;
  return y;
}

function draw() {
  setInterval(mark(), MARKING_SPEED);
}

function mark() {
  var pixel = rectangle(x, y, 10, 10);
  $(document).append(pixel);
}

function rectangle (x, y, w, h) {
  // creating the div that will be the rectangle using jQuery
  var pixel = $('<div></div>'); 

  // storing properties in the rectangle object
  pixel.x = x;
  pixel.y = y;
  pixel.w = w;
  pixel.h = h;

  // Then we set up the CSS of the div so that it looks like a rectangle
  // in the location we want it.
  //
  // Using transform's translate()
  pixel.css({ 
    position: 'absolute',
    width: pixel.w + 'px',
    height: pixel.h + 'px', 
    transform: 'translate(' + pixel.x + 'px, ' + pixel.y + 'px)',
    backgroundColor: 'springgreen'
  }); 

  return pixel;
}

function stopDrawing() {

}

function clickedClear() {
  voice();
  clearPage();
}

function voice() {
  var comment = [
    "say goodbye now",
    "let's start again",
    "another one",
    "aahh fresh start",
    "the blank canvas",
    "what will you make now"
  ]

  var randomComment = comment[Math.floor(Math.random() * comment.length)];

  responsiveVoice.speak(randomComment, "UK English Male", {pitch: .5, rate: .8})
}

function clearPage() {
  
}
