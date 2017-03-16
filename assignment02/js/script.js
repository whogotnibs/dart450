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

//updating the animation this often
const ANI_INT = 100;

//a counter variable that will stop spinning after 90deg
var n = 0;

var d;

//making a global variable for the spinning and animating intervals
//this way they can be cleared with clearInterval()
var spinning;

//a place to store the window and canvas width/height
var windowWidth;
var windowHeight;
var canvasWidth;
var canvasHeight;

//a place to store the eiseljs drawing stage and lines for animating
var stage;
var lineA;
var lineB;
var lineC;
var lineD;
var lineE;
var lineF;
var lineG;
var lineH;

//and the keypoints used to draw them
var ax;
var ay;
var bx;
var by;
var cx;
var cy;
var dx;
var dy;

$(document).ready(function() {

animate ();

spin ();

});

//a function that lets you spin 90deg (either direction) with the arrow keys
function spin () {
  $(document).keydown(function (event){

    //dont allow the user to start a new spinning interval if they are
    //already spinning
    if (n != 0) {}

    //if the right arrow key is pressed down spin clockwise
    //
    else if (event.which == 39) {
      d = 0;
      spinning = setInterval(rotate, SPIN_INT);
    }

    //if the left arrow key is pressed down spin counter clockwise
    else if (event.which == 37) {
      d = 1;
      spinning = setInterval(rotate, SPIN_INT);
    }
  });
}

function rotate () {
  //clockwise
  if (d == 0) {
    //add to the current orientation...
    orientation = orientation + SPIN_DEG;
  }
  //counter clockwise
  else {
    //subtract from the current orientation...
    orientation = orientation - SPIN_DEG;
  }

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
  $('#compass').css({

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

  setInterval(animateSpin, ANI_INT);
}

//a function moving keypoints accross the screen
//and calling line animations as the player spins
function animateSpin () {
  //these equations move points A(x,y) and B(x,y) accross the screen
  //based on n (the spin counter), d (the direction of spin), and the scale

  //this constant is used to scale the wall relative to the size of the canvas
  const SCALE = 0.9;

  //move the keypoints if spinning clockwise
  if (d != 1) {

    //for the first half of the turn (0-45deg)...
    if (n < 45) {
      ax = bx = (canvasWidth*(1-SCALE))-(canvasWidth*(1-SCALE)*(n/45));
      cx = dx = (canvasWidth*(1-SCALE))+(canvasWidth*(SCALE-(1-SCALE))*(1-(n/90)));
      ay = canvasHeight*(1-SCALE)*(1-(n/45));
      by = canvasHeight-(canvasHeight*(1-SCALE)*(1-(n/45)));
      cy = canvasHeight*(1-SCALE)+(canvasHeight*(1-SCALE)*(n/45));
      dy = canvasHeight*SCALE-(canvasHeight*(1-SCALE)*(n/45));
    }
    //and for the second half of the turn (45-90deg)
    else if (n >= 45) {
      ax = bx = canvasWidth-(canvasWidth*(1-SCALE)*((n-45)/45));
      cx = dx = (canvasWidth*(1-SCALE))+(canvasWidth*(SCALE-(1-SCALE))*(1-(n/90)));
      ay = canvasHeight*(1-SCALE)*((n-45)/45);
      by = canvasHeight-(canvasHeight*(1-SCALE)*((n-45)/45));
      cy = canvasHeight*(1-SCALE)+(canvasHeight*(2*(1-SCALE))*(1-(n/90)));
      dy = canvasHeight*SCALE-(canvasHeight*(2*(1-SCALE))*(1-(n/90)));
    }
  }

  //move keypoints if spinning counter clockwise
  else {

    //for the first half of the turn (0-45deg)...
    if (n < 45) {
      ax = bx = (canvasWidth*(1-SCALE))+(canvasWidth*(SCALE-(1-SCALE))*(n/90));
      cx = dx = (canvasWidth*(1-SCALE))-(canvasWidth*(1-SCALE)*(1-(n/45)))+(canvasWidth*(SCALE));
      ay = canvasHeight*(1-SCALE)+(canvasHeight*(1-SCALE)*(n/45));
      by = canvasHeight*SCALE-(canvasHeight*(1-SCALE)*(n/45));
      cy = canvasHeight*(1-SCALE)*(1-(n/45));
      dy = canvasHeight-(canvasHeight*(1-SCALE)*(1-(n/45)));
    }
    //and for the second half of the turn (45-90deg)
    else if (n >= 45) {
      ax = bx = (canvasWidth*(1-SCALE))+(canvasWidth*(SCALE-(1-SCALE))*(n/90));
      cx = dx = (canvasWidth*(1-SCALE)*((n-45)/45));
      ay = canvasHeight*(1-SCALE)+(canvasHeight*(2*(1-SCALE))*(1-(n/90)));
      by = canvasHeight*SCALE-(canvasHeight*(2*(1-SCALE))*(1-(n/90)));
      cy = canvasHeight*(1-SCALE)*((n-45)/45);
      dy = canvasHeight-(canvasHeight*(1-SCALE)*((n-45)/45));
    }
  }

  //set the canvas as the drawing stage
  stage = new createjs.Stage("canvas");

  //animate each of the lines that make up the spinning room
  for (var l = 0; l < 8; l++) {
    animateRoomLines (l);
  }
}

//a function that redraws each of the room's lines
//in a new position based on the movement of keypoints A and B
function animateRoomLines (l) {
  //an array storing the stats of each line (A-E) used in the animation
  //each line is then animated with eiseljs based on the array
  var line = [
    //[name, startX, startY, first45-endX, first45-endY, last45-endX, last45-endY]
    [lineA, ax, ay, bx, by, bx, by],
    [lineB, cx, cy, dx, dy, dx, dy],
    [lineC, ax, ay, cx, cy, cx, cy],
    [lineD, bx, by, dx, dy, dx, dy],
    [lineE, 0, 0, ax, ay, cx, cy],
    [lineF, canvasWidth, 0, cx, cy, ax, ay],
    [lineG, 0, canvasHeight, bx, by, dx, dy],
    [lineH, canvasWidth, canvasHeight, dx, dy, bx, by]
  ];

  //create a new shape
  line[l][0] = new createjs.Shape();

  //set the line style
  line[l][0].graphics.setStrokeStyle(3);
  line[l][0].graphics.beginStroke('black');

  //draw a line using the info from the array
  //set the starting point of the line...
  line[l][0].graphics.moveTo(line[l][1], line[l][2]);
  //and where to draw to
  //during the first 45deg..
  if (n < 45) {
    line[l][0].graphics.lineTo(line[l][3], line[l][4]);
  }
  //and the last 45deg
  else {
    line[l][0].graphics.lineTo(line[l][5], line[l][6]);
  }

  line[l][0].graphics.endStroke();

  //add the new lines and update the drawing stage
  stage.addChild(line[l][0]);
  stage.update();
}
