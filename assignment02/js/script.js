/*

3d Maze
Thomas Bell

Spin around with the arrow keys(for now)

*/

//start the game facing north
var orientation = 0;

//how many degrees to spin...
const SPIN_DEG = 1;
//over this many milliseconds
const SPIN_INT = 15;

//a counter variable that will stop spinning after 90deg
var n = 0;

//making a global variable for the spinning and animating intervals
//this way they can be cleared with clearInterval()
var spinning;
var animating;

//a place to store the window and canvas width/height
var windowWidth;
var windowHeight;
var canvasWidth;
var canvasHeight;

//a place to store the eiseljs canvas and lines for animating
var stage;
var lineA;
var lineB;
var lineC;
var lineD;
var lineE;

$(document).ready(function() {

spin ();

animate ();

});

//a function that lets you spin 90deg (either direction) with the arrow keys
function spin () {
  $(document).keydown(function (event){

    //dont allow the user to start a new spinning interval if they are
    //already spinning
    if (n != 0) {}

    //if the right arrow key is pressed down spin clockwise
    else if (event.which == 39) {
      spinning = setInterval(spinClockwise, SPIN_INT);
    }

    //if the left arrow key is pressed down spin counter clockwise
    else if (event.which == 37) {
      spinning = setInterval(spinCounterClockwise, SPIN_INT);
    }
  });
  return n;
}

function spinClockwise () {

  //add to the current orientation...
  orientation = orientation + SPIN_DEG;
  //and add that same difference to the counter
  n = n + SPIN_DEG;

  //loop the orientation at 360deg as it approaches 0 or 360
  checkLoop ();

  //rotate the compass based on the current orientation
  compass ();

  //log the new orientation
  // console.log(orientation);

  //stop spinning when the counter reaches 90 (N, E, S, or W)
  if (n >= 90 / SPIN_DEG) {

    //clear the spinning interval...
    clearInterval(spinning);
    //then reset the counter...
    n = 0;
    //and log the orientation that the player is now facing
    // console.log(orientation + 'done spin');
  }
}

function spinCounterClockwise () {

  //subtract from the current orientation...
  orientation = orientation - SPIN_DEG;
  //and subtract that same difference from the counter
  n = n + SPIN_DEG;

  //loop the orientation at 360deg as it approaches 0 or 360
  checkLoop ();

  //rotate the compass based on the current orientation
  compass ();

  //log the new orientation
  // console.log(orientation);

  //stop spinning when the counter reaches -90 (N, E, S, or W)
  if (n >= 90 / SPIN_DEG) {

    //clear the spinning interval...
    clearInterval(spinning);
    //then reset the counter...
    n = 0;
    //and log the orientation that the player is now facing
    // console.log(orientation + 'done spin');
  }
}

//a function that loops the orientation at 360 to mimick spinning a full 360 deg
function checkLoop () {

  //loop when approaching 360/0 from a clockwise spin
  if (orientation >= 361) {
    orientation = 0 + SPIN_DEG;
  }
  //loop when approaching 360/0 from a counter clockwise spin
  else if (orientation <= -1) {
    orientation = 360 - SPIN_DEG;
  }
  //use 0 in place of 360
  else if (orientation == 360) {
    orientation = 0;
  }
}

//a function that rotates the compass based on the orientation
function compass () {
  $('.compass').css({

    //the compass needs to rotate the opposite direction
    //than the player is spinning
    transform: 'rotate('+ (360 - orientation) +'deg)'
  });
}

//a function that animates the players movements in the maze
function animate() {
  //storing the dimensions of the window and canvas in variables
  canvasWidth = $('#canvas').width();
  canvasHeight = $('#canvas').height();
  windowHeight = $('body').height();
  windowWidth = $('body').width();

  //center the canvas
  $('#canvas').css({
    top: (windowHeight/2)-(canvasHeight/2),
    left: (windowWidth/2)-(canvasWidth/2),
  })

  //set the canvas as the drawing stage
  stage = new createjs.Stage("canvas");

  //lines A - E will be used to animate the room while spinning
  lineA = new createjs.Shape();
  lineB = new createjs.Shape();
  lineC = new createjs.Shape();
  lineD = new createjs.Shape();
  lineE = new createjs.Shape();

  //dont allow the room to animate if the player is already spinning
  if (n != 0) {}
  else {
    $(document).keydown(function (event){

      //if the right arrowkey is pressed, animate the scene accordingly
      if (event.which == 39) {
        //clear the animating interval...
        clearInterval(animating);
        //and then start animating the room clockwise
        //the argument on 'animateSpin' dictates the direction (0=clockwise, 1=cc)
        animating = setInterval(function(){animateSpin(0)}, 100);
      }
      //do the same for the left arrowkey
      else if (event.which == 37) {
        clearInterval(animating);
        animating = setInterval(function(){animateSpin(1)}, 100);
      }
    });
  }

}

//a function moving keypoints accross the screen
//and calling line animations as the player spins
function animateSpin (d) {
  //these equations move points A(x,y) and B(x,y) accross the screen
  //based on n (the spin counter) and d (the direction of spin)

  //moving the x values accross the screen R to L if clockwise...
  if (d == 0) {
    var ax = (1-(n/90))*canvasWidth;
    var bx = (1-(n/90))*canvasWidth;
  }
  //and L to R if counter clockwise
  else {
    var ax = canvasWidth-((1-(n/90))*canvasWidth);
    var bx = canvasWidth-((1-(n/90))*canvasWidth);
  }

  //move the y values closer together for the first half of the turn (0-45deg)...
  if (n < 45) {
    var ay = ((n/90)*canvasHeight*0.2);
    var by = canvasHeight-((n/90)*canvasHeight*0.2);
  }
  //and further apart for the second half of the turn (45-90deg)
  else if (n >= 45) {
    var ay = ((1-(n/90))*canvasHeight*0.2);
    var by = canvasHeight-((1-(n/90))*canvasHeight*0.2);
  }


  //animate each of the lines that make up the spinning room
  var l;
  animateRoomLines (ax, ay, bx, by, 0);
  animateRoomLines (ax, ay, bx, by, 1);
  animateRoomLines (ax, ay, bx, by, 2);
  animateRoomLines (ax, ay, bx, by, 3);
  animateRoomLines (ax, ay, bx, by, 4);
}

//a function that erases then redraws each of the room's lines
//in a new position based on the movement of keypoints A and B
function animateRoomLines (ax, ay, bx, by, l) {
  //an array storing the stats of each line
  //each line is then animated with eiseljs based on the array
  var line = [
    [lineA, ax, ay, bx, by],
    [lineB, 0, 0, ax, ay],
    [lineC, canvasWidth, 0, ax, ay],
    [lineD, 0, canvasHeight, bx, by],
    [lineE, canvasWidth, canvasHeight, bx, by]
  ];

  
  //clear existing lines and set the line style
  line[l][0].graphics.clear();
  line[l][0].graphics.setStrokeStyle(3);
  line[l][0].graphics.beginStroke('black');

  //draw a line using the info from the array
  //(if the player is spinning)
  if (n > 0) {
    //set the starting point of the line...
    line[l][0].graphics.moveTo(line[l][1], line[l][2]);
    //and where to draw to
    line[l][0].graphics.lineTo(line[l][3], line[l][4]);
    line[l][0].graphics.endStroke();
  }

  //add and update the new lines
  stage.addChild(line[l][0]);
  stage.update();

}
