/*

3d Maze
Thomas Bell

Spin around with the arrow keys(for now)

*/

//organizing the rooms
var room = [
  //[room connected to north wall, "..."east, "..."south, "..."west, room colour]
  /*0*/[null, 1, 2, 3, 'white'],
  /*1*/[null, null, null, 0, 'lavenderblush'],
  /*2*/[0, null, 6, null, 'honeydew'],
  /*3*/[null, 0, null, 4, 'azure'],
  /*4*/[null, 3, 5, null, 'beige'],
  /*5*/[4, null, null, null, 'cornsilk'],
  /*6*/[2, 7, 8, null, 'oldlace'],
  /*7*/[null, null, 9, 6, 'aliceblue'],
  /*8*/[6, 9, null, null, 'ivory'],
  /*9*/[7, 10, null, 8, 'ghostwhite'],
  /*10*/[null, null, 11, 9, 'mintcream'],
  /*11*/[10, 13, 12, null, 'lightyellow'],
  /*12*/[11, null, null, null, 'seashell'],
  /*13*/[null, null, null, 11, 'papayawhip'],
];

//start in the 0th room
var r = 0;

//start facing a wall with no hole
//(two vars to accomodate the case where a hole is leaving while one is entering)
var hole = false;
var holeIn = false;

//variables that show what walls the player can see
//(two vars because sometimes while spining 2 holes can be seen)
var f = 0;
var secondf;

//start the game facing north
var orientation = 0;

//how many degrees to spin...
const SPIN_DEG = 1;
//over this many milliseconds
const SPIN_INT = 15;

//updating the forward movement through a hole this often
const MOVE_INT = 5;

//updating the animation this often
const ANI_INT = 100;

//a counter variable that will stop spinning after 90deg
var n = 0;

//a counter variable that will stop when the player has moved through a hole
var m = 0;

//a variable for the direction of spinning
var d;

//making a global variable for the 'spinning' and 'moving' intervals
//this way they can be cleared with clearInterval()
var spinning;
var moving;

//a place to store the window and canvas width/height
var windowWidth;
var windowHeight;
var canvasWidth;
var canvasHeight;

//a place to store the eiseljs drawing stage and lines for animating...
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

//a place to store key values for animating holes
var hx;
var hy;
var hw;
var hh;
//a second set of values so that there may be two holes on the screen at once
var secondhx;
var secondhy;
var secondhw;
var secondhh;

//the height and width of the holes when not spinning (facing a wall)
const HOLE_SIZE = 150;
//how much the holes change in size during a spin to simulate perspective
const HOLE_GROWTH = 75;

$(document).ready(function() {

animate ();

spin ();

move ();

setInterval(info, SPIN_INT);

});


//a function that lets you spin 90deg (either direction) with the arrow keys
function spin () {
  $(document).keydown(function (event){

    //dont allow the user to start a new spinning interval if they are
    //already spinning or moving
    if (n != 0) {}

    //if the right arrow key is pressed down spin clockwise
    else if (event.which == 39) {
      //clockwise, d = 0
      d = 0;
      spinning = setInterval(rotate, SPIN_INT);
    }

    //if the left arrow key is pressed down spin counter clockwise
    else if (event.which == 37) {
      //counter clockwise, d = 1
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

  //stop spinning when the counter reaches 90 (N, E, S, or W)
  if (n >= 90 / SPIN_DEG) {

    //clear the spinning interval...
    clearInterval(spinning);
    //then reset the counter...
    n = 0;
  }

  //check for a hole entering/exiting the scene
  checkHole ();

  //check what rooms(s) the player can see through holes
  checkFacing ();

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

//a function that keeps track of the status of holes in a room
function checkHole () {
  //if a hole is coming into the scene
  if (
  //clockwise
  ((d == 0) &&
  ((orientation > 0 && orientation < 90 && room[r][1] != null)||
  (orientation > 90 && orientation < 180 && room[r][2] != null)||
  (orientation > 180 && orientation < 270 && room[r][3] != null)||
  (orientation > 270 && room[r][0] != null)))||
  //counter clockwise
  (d == 1) &&
  ((orientation > 0 && orientation < 90 && room[r][0] != null)||
  (orientation > 90 && orientation < 180 && room[r][1] != null)||
  (orientation > 180 && orientation < 270 && room[r][2] != null)||
  (orientation > 270 && room[r][3] != null))) {
    holeIn = true;
  }

  //if a hole is leaving the scene
  if (
  //clockwise
  ((d == 0) &&
  ((orientation > 0 && orientation < 90 && room[r][0] != null)||
  (orientation > 90 && orientation < 180 && room[r][1] != null)||
  (orientation > 180 && orientation < 270 && room[r][2] != null)||
  (orientation > 270 && room[r][3] != null)))||
  //counter clockwise
  (d == 1) &&
  ((orientation > 0 && orientation < 90 && room[r][1] != null)||
  (orientation > 90 && orientation < 180 && room[r][2] != null)||
  (orientation > 180 && orientation < 270 && room[r][3] != null)||
  (orientation > 270 && room[r][0] != null))) {
    hole = 'out';
  }

  //if the player is not spinning and they are facing a wall with a hole
  else if ((orientation == 0 && room[r][0] != null)||
  (orientation == 90 && room[r][1] != null)||
  (orientation == 180 && room[r][2] != null)||
  (orientation == 270 && room[r][3] != null)) {
    hole = true;
    holeIn = false;
  }
  else {
    hole = false;
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
  });

  setInterval(animateSpin, ANI_INT);
}

//a function moving keypoints accross the screen
//and calling line animations as the player spins
function animateSpin () {
  //these equations move points A(x,y), B(x,y), C(x,y), and D(a,y) accross the screen
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

  //animate any holes
  animateHoles ();

  //animate moving through a hole
  if (m != 0) {
    animateMove ();
  }

  //set the room to its colour
  $('#canvas').css({
    'background-color': room[r][4]
  })

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
}

//a function that adjusts key values and calls the holes to animate based on the values
function animateHoles () {

  //dont draw a hole if there are none
  if (hole == false) {
    hw = hh = 0;
  }
  //values for a hole in the center of the wall (not spinning)
  else if (hole == true) {
    hw = HOLE_SIZE;
    hh = HOLE_SIZE;
    hx = (canvasWidth/2)-(hw/2);
    hy = (canvasHeight/2)-(hh/2);
  }
  //values for a hole leaving the scene (except x)
  else if (hole == 'out') {
    hw = HOLE_SIZE-HOLE_GROWTH*(n/90);
    hh = HOLE_SIZE+HOLE_GROWTH*(n/90);
    hy = (canvasHeight/2)-(hh/2);
  }
  //values for a hole entering the scene (except x)
  if (holeIn == true) {
    secondhw = (HOLE_SIZE-HOLE_GROWTH)+HOLE_GROWTH*(n/90);
    secondhh = (HOLE_SIZE+HOLE_GROWTH)-HOLE_GROWTH*(n/90);
    secondhy = (canvasHeight/2)-(secondhh/2);
  }

  //now editing the x values if spinning clockwise...
  if (d != 1) {
    if (hole == 'out') {
      hx = ((canvasWidth/2)-(hw/2))-(((canvasWidth/2)+hw)*(n/90));
    }
    if (holeIn == true) {
      secondhx = canvasWidth-((canvasWidth/2+(secondhw/2))*(n/90));
    }
  }
  //and counter clockwise
  else {
    if (holeIn == true) {
      secondhx = ((canvasWidth/2)-(secondhw/2))-(((canvasWidth/2)+secondhw)*(1-(n/90)));
    }
    if (hole == 'out') {
      hx = canvasWidth-((canvasWidth/2+(hw/2))*(1-(n/90)));
    }
  }

  //animate holes leaving the scene (aswell as if not spinning)
  animateHoleOut ();


  //animate holes entering the scene
  if (holeIn == true) {
    animateHoleIn ();
  }
}

//a function that draws a new ellipse with easeljs every animation update
//using key values for a hole leaving the scene (aswell as non-moving holes)
function animateHoleOut () {

  //create a new shape
  hole = new createjs.Shape();

  //set the stroke style
  hole.graphics.setStrokeStyle(3);
  hole.graphics.beginStroke('black');

  //draw an ellipse using the key values for its location and size
  //colour it based on the next room through the hole
  if (room[r][f] != null) {
    hole.graphics.beginFill(room[room[r][f]][4]).drawEllipse(hx, hy, hw, hh);
  }


  hole.graphics.endStroke();

  //add the new hole and update the drawing stage
  stage.addChild(hole);
  stage.update();
}

//a function that draws a new ellipse with easeljs every animation update
//using key values for a hole entering the scene
function animateHoleIn () {

  //create a new shape
  secondHole = new createjs.Shape();

  //set the stroke style
  secondHole.graphics.setStrokeStyle(3);
  secondHole.graphics.beginStroke('black');

  //draw an ellipse using the key values for its location and size
  //colour it based on the next room through the hole
  secondHole.graphics.beginFill(room[room[r][secondf]][4]).drawEllipse(secondhx, secondhy, secondhw, secondhh);

  secondHole.graphics.endStroke();

  //add the new hole and update the drawing stage
  stage.addChild(secondHole);
  stage.update();
}

//a function that records the direction of each wall
//that the player can see during a spin (or while still)
function checkFacing () {

  //N>E (c)
  if (d == 0 && orientation > 0 && orientation < 90){
    f = 0;
    secondf = 1;
  }

  //E>S (c)
  else if (d == 0 && orientation > 90 && orientation < 180){
    f = 1;
    secondf = 2;
  }

  //S>W (c)
  else if (d == 0 && orientation > 180 && orientation < 270){
    f = 2;
    secondf = 3;
  }

  //W>N (c)
  else if (d == 0 && orientation > 270){
    f = 3;
    secondf = 0;
  }

  //N>W (cc) and N
  else if ((d == 1 && orientation > 270)||(orientation == 0)){
    f = 0;
    secondf = 3;
  }

  //W>S (cc) and W
  else if ((d == 1 && orientation > 180 && orientation < 270)||(orientation == 270)){
    f = 3;
    secondf = 2;
  }

  //S>E (cc) and S
  else if ((d == 1 && orientation > 90 && orientation < 180)||(orientation == 180)){
    f = 2;
    secondf = 1;
  }

  //E>N (cc) and E
  else if ((d == 1 && orientation > 0 && orientation < 90)||(orientation == 90)){
    f = 1;
    secondf = 0;
  }
}

function move () {
  $(document).keypress(function (event){

    //dont allow the user to move through a hole if they are spinning or moving
    if (n != 0 || m != 0) {}

    //if the spacebar is pressed and if there is a hole, move through the hole
    else if (event.which == 32 && room[r][f] != null) {
      moving = setInterval(forward, MOVE_INT);
    }
  });
}

function forward () {
  //advance the counter
  m = m + 1;
  //stop at 100
  if (m >= 100) {
    //update the room
    r = room[r][f];
    //clear the moving interval...
    clearInterval(moving);
    //then reset the counter...
    m = 0;

    //fade out the instructions once the player has left the 0th room
    //and fade in the room colour
    if (r != 0) {
      $(".instructions").animate({
        opacity: 0
      }, 1000);
    }


  }
  console.log(m, r);
}

function animateMove () {
  var grow = (HOLE_SIZE/2)+canvasWidth/2*(m/100);

  //hide the lines in the room to simplify the moving animation
  stage.removeAllChildren();

  //create a new shape
  hole = new createjs.Shape();

  //set the stroke style
  hole.graphics.setStrokeStyle(3);
  hole.graphics.beginStroke('black');

  //draw a circle using the key values to expand it as the player moves forwards
  hole.graphics.beginFill(room[room[r][f]][4]).drawCircle(0, 0, grow);
  hole.x = canvasWidth/2;
  hole.y = canvasHeight/2;

  hole.graphics.endStroke();

  //add the new hole and update the drawing stage
  stage.addChild(hole);
  stage.update();
}

function info () {
  $('.info').remove(txt);

  if (room[r][f] == undefined || room[r][f] == null) {
    var facing = "none";
  }
  else {
    var facing = room[room[r][f]][4];
  }

  var txt = $("<p class='info'>" +
    "room: " + room[r][4] + "<br/>" +
    "facing-room: " + facing + "</p>");

  $('body').append(txt);
}
