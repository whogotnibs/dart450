/*

ROOMS
Thomas Bell

Spin around with the arrow keys(for now)

*/

//organizing the rooms
var room = [
  //[room connected to north wall, "..."east, "..."south, "..."west, room colour]
  /*0*/[null, null, 1, null, 'red'],
  /*1*/[0, 3, null, 2, 'navajowhite'],
  /*2*/[null, 1, null, null, 'powderblue'],
  /*3*/[null, 4, null, 1, 'rosybrown'],
  /*4*/[6, 5, 8, 3, 'khaki'],
  /*5*/[null, null, null, 4, 'aquamarine'],
  /*6*/[7, null, 4, null, 'violet'],
  /*7*/[null, null, 6, null, 'salmon'],
  /*8*/[4, null, 9, null, 'slateblue'],
  /*9*/[8, 11, null, 10, 'darkseagreen'],
  /*10*/[null, 9, null, null, 'peru'],
  /*11*/[null, 12, null, 9, 'peachpuff'],
  /*12*/[null, null, 13, 11, 'brown'],
  /*13*/[12, null, 14, null, 'goldenrod'],
  /*14*/[13, null, null, 15, 'chartreuse'],
  /*15*/[null, 14, null, 16, '#7fdf00'],
  /*16*/[null, 15, null, 17, '#7fbf00'],
  /*17*/[null, 16, null, 18, '#7f9f00'],
  /*18*/[null, 17, null, 19, '#7f7f00'],
  /*19*/[20, 18, null, 21, '#7f5f00'],
  /*20*/[null, null, 19, null, 'gold'],
  /*21*/[null, 19, null, 22, '#7f3f00'],
  /*22*/[null, 21, null, 23, '#7f1f00'],
  /*23*/[null, 22, null, null, 'black'],
  /*24*/[23, null, 26, null, 'thistle'],
  /*25*/[null, null, 23, null, 'fuchsia'],
  /*26*/[24, null, null, 27, 'honeydew'],
  /*27*/[null, 26, null, 29, 'darkorchid'],
  /*28*/[30, null, 29, null, 'paleturquoise'],
  /*29*/[28, 27, null, 31, 'forestgreen'],
  /*30*/[30, 30, 30, 30, 'lime'],
  /*31*/[null, 29, null, 32, 'teal'],
  /*32*/[33, 31, null, null, 'orange'],
  /*33*/[34, null, 32, null, 'lavender'],
  /*34*/[35, null, 33, null, 'crimson'],
  /*35*/[null, null, null, null, 'navy'],
  /*36*/[null, null, null, 35, 'white']
];

//start in the 0th room
var r = 0;
//set the previous room
var pr = -1;

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
const SPIN_INT = 5;

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

var solved;

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

//variables to keep track of items (so you cant pick them up twice)
var note;
var comp;
var colouridtool;
var packageOne;
var lantern;
var packageTwo;
var roomsim;
var navy;
var packageThree;
var packageFour;

var lanternActivated = false;
var colourIDActivated = false;
var compassActivated = false;

//so we can prevent things from running once the game is over
var end;

var cheat;

$(document).ready(function() {

Gibber.init();

if (end != true) {
  animate ();

  spin ();

  move ();

  setInterval(colourID, ANI_INT);

  specialRooms ();

  codes ();
}

});


//a function that lets you spin 90deg (either direction) with the arrow keys
function spin () {
  $(document).keydown(function (event){

    //dont allow the user to start a new spinning interval if they are
    //already spinning or moving
    if (n != 0 || m != 0) {}

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

    //if the up arrow key is pressed down move forward
    else if (event.which == 38 && room[r][f] != null) {
      moving = setInterval(forward, MOVE_INT);
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
    //check to see if player is in the navy or lime rooms
    if (r == 35 && navy != "seen") {
      navy = "seen";
      setTimeout(navyRoom, 10000);
    }
    if (r == 30 && packageFour != "seen") {
      packageFour = "seen";
      setTimeout(limeRoom, 10000);
    }

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
  if (compassActivated == true) {
    $('#compass').css({
      visibility: "visible",
      //the compass needs to rotate the opposite direction
      //than the player is spinning
      transform: 'rotate('+ (360 - orientation) +'deg)'
    });
  }
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

  //creating errors for the navy room
  if (r == 35 && solved != true) {
    if (d != 1 && n < 45) {
      by = canvasHeight-(canvasHeight*(SCALE)*(1-(n/45)));
    }
    if (d == 1 && n < 45) {
      cy = canvasHeight*(SCALE)*(1-(n/45));
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
  //***white stroke in the navy room
  if (r == 35) {
    line[l][0].graphics.beginStroke('white');
  }
  else {
    line[l][0].graphics.beginStroke('black');
  }

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
  //***white stroke in the navy room
  if (r == 35) {
    hole.graphics.beginStroke('white');
  }
  else {
    hole.graphics.beginStroke('black');
  }

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
  //***white stroke in the navy room
  if (r == 35) {
    secondHole.graphics.beginStroke('white');
  }
  else {
    secondHole.graphics.beginStroke('black');
  }
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

//
function forward () {
  //advance the counter
  m = m + 1;
  //stop at 100
  if (m >= 100) {
    pr = r;
    //update the room
    r = room[r][f];
    //clear the moving interval...
    clearInterval(moving);
    //then reset the counter...
    m = 0;

    //check if there is something special to be done (dialog box, download, etc.)
    specialRooms ();

    //fade out the instructions once the player has left the 0th room
    //and fade in the room colour
    if (r != 0) {
      $(".instructions").animate({
        opacity: 0
      }, 1000);
    }

    //play the appropriate music for the room
    if ((r == 1 && pr == 0 && note != 'seen')||(r == 13 && pr == 14)) {
      setTimeout(stageOneMusic,100);
      Gibber.clear();
    }
    else if ((r == 14 && pr == 13)||(r == 26 && pr == 27)) {
      setTimeout(stageTwoMusic,100);
      Gibber.clear();
    }
    else if (r == 27 && pr == 26) {
      setTimeout(stageThreeMusic,100);
      Gibber.clear();
    }
    else if (r == 30 && pr == 29) {
      setTimeout(limeMusic,100);
      Gibber.clear();
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
  //***white stroke in the navy room
  if (r == 35) {
    hole.graphics.beginStroke('white');
  }
  else {
    hole.graphics.beginStroke('black');
  }

  //draw a circle using the key values to expand it as the player moves forwards
  hole.graphics.beginFill(room[room[r][f]][4]).drawCircle(0, 0, grow);
  hole.x = canvasWidth/2;
  hole.y = canvasHeight/2;

  hole.graphics.endStroke();

  //add the new hole and update the drawing stage
  stage.addChild(hole);
  stage.update();
}

//the colour id tool
function colourID () {
  if (colourIDActivated == true) {

    $('.info').remove(txt);

    if (room[r][f] == undefined || room[r][f] == null) {
      facing = "none";
    }
    else {
      facing = room[room[r][f]][4];
    }

    var txt = $("<p class='info'>" +
      "room: " + room[r][4] + "<br/>" +
      "facing-room: " + facing + "</p>");

    $('body').append(txt);
  }
}


function specialRooms () {
  if (r == 1 && note != "seen") {
    navajoRoom ();
  }
  if (r == 4 && comp != "seen") {
    khakiRoom ();
  }
  if (r == 11 && colouridtool != "seen") {
    peachpuffRoom ();
  }
  if (r == 13 && packageOne != "seen") {
    goldenrodRoom ();
  }
  if (r == 20 && lantern != "seen") {
    goldRoom ();
  }
  if (r == 23 && lanternActivated != true) {
    darkRoom ();
  }
  if (r == 26 && packageTwo != "seen") {
    honeydewRoom ();
  }
  if (r == 30 && packageFour != "seen") {
    packageFour = "seen";
    setTimeout(limeRoom, 10000);
  }
  if (r == 33 && roomsim != "seen") {
    lavenderRoom ();
  }
  if (r == 36) {
    end ();
  }
}

function navajoRoom () {
  var dialogButtonAResults = function() {
    $(this).dialog("close");
    location.href = '../downloads/note01.rtf';
    note = 'seen';
  }
  var dialogButtonBResults = function() {
    $(this).dialog("close");
  }
  dialogBox('A NOTE!', 'You found a <i>note</i>. Pick up the <i>note</i>?', 'Pick It Up', dialogButtonAResults, 'Leave It', dialogButtonBResults);
}

function khakiRoom () {
  var dialogButtonAResults = function() {
    $(this).dialog("close");
    location.href = '../downloads/compass.rtf';
    comp = 'seen';
  }
  var dialogButtonBResults = function() {
    $(this).dialog("close");
  }
  dialogBox('A COMPASS!', 'You found a <i>compass</i>. Pick up the <i>compass</i>?', 'Pick It Up', dialogButtonAResults, 'Leave It', dialogButtonBResults);
}

function peachpuffRoom () {
  var dialogButtonAResults = function() {
    $(this).dialog("close");
    location.href = '../downloads/colour_id_tool.rtf';
    colouridtool = 'seen';
  }
  var dialogButtonBResults = function() {
    $(this).dialog("close");
  }
  dialogBox('A COLOUR ID TOOL!', 'You found a <i>colour ID tool</i>. Pick up the <i>colour ID tool</i>?', 'Pick It Up', dialogButtonAResults, 'Leave It', dialogButtonBResults);
}

function goldenrodRoom () {
  var dialogButtonAResults = function() {
    $(this).dialog("close");
    location.href = '../downloads/package01.zip';
    packageOne = 'seen';
  }
  var dialogButtonBResults = function() {
    $(this).dialog("close");
  }
  dialogBox('A PACKAGE!', 'You found a <i>package</i>. Pick up the <i>package</i>?', 'Pick It Up', dialogButtonAResults, 'Leave It', dialogButtonBResults);
}

function goldRoom () {
  var dialogButtonAResults = function() {
    $(this).dialog("close");
    location.href = '../downloads/lantern.rtf';
    lantern = 'seen';
  }
  var dialogButtonBResults = function() {
    $(this).dialog("close");
  }
  dialogBox('A LANTERN!', 'You found a <i>lantern</i>. Pick up the <i>lantern</i>?', 'Pick It Up', dialogButtonAResults, 'Leave It', dialogButtonBResults);
}

function darkRoom () {
  var dialogButtonAResults = function() {
    $(this).dialog("close");
  }
  dialogBox('DARKNESS!', 'This part of the map is too dark to explore without a lantern', 'OK', dialogButtonAResults)
}

function pinkRoom () {
  room[23] = [25, 22, 24, null, 'pink'];
}

function honeydewRoom () {
  var dialogButtonAResults = function() {
    $(this).dialog("close");
    location.href = '../downloads/package02.zip';
    packageTwo = 'seen';
  }
  var dialogButtonBResults = function() {
    $(this).dialog("close");
  }
  dialogBox('A PACKAGE!', 'You found a <i>package</i>. Pick up the <i>package</i>?', 'Pick It Up', dialogButtonAResults, 'Leave It', dialogButtonBResults);
}

function limeRoom () {
  var dialogButtonAResults = function() {
    $(this).dialog("close");
    location.href = '../downloads/package04.zip';
  }
  var dialogButtonBResults = function() {
    $(this).dialog("close");
    packageFour = "closed";
  }
  dialogBox('A PACKAGE!', 'You found a <i>package</i>. Pick up the <i>package</i>?', 'Pick It Up', dialogButtonAResults, 'Leave It', dialogButtonBResults);
}

function lavenderRoom () {
  var dialogButtonAResults = function() {
    $(this).dialog("close");
    location.href = '../downloads/CONFIDENTIAL.zip';
  }
  var dialogButtonBResults = function() {
    $(this).dialog("close");
    roomsim = "closed";
  }
  dialogBox('A FILE!', 'You found a <i>file</i>. Pick up the <i>file</i>?', 'Pick It Up', dialogButtonAResults, 'Leave It', dialogButtonBResults);
}

function navyRoom () {

  var navyDialog = $('<div id="dialogBox" title="FIX ROOM"><p></div>');
  var dialogx = canvasWidth/2;
  var dialogy = windowHeight/2;

  var textOne = '<p><span class="comment">//move the keypoints if spinning clockwise</span><br>'
  +'if (d != 1) {<br>'
  +'&emsp;<span class="comment">//for the first half of the turn (0-45deg)...</span><br>'
  +'&emsp;if (n < 45){<br>'
  +'&emsp;&emsp;ax = bx = (canvasWidth*(1-SCALE))-(canvasWidth*(1-SCALE)*(n/45));<br>'
  +'&emsp;&emsp;cx = dx = (canvasWidth*(1-SCALE))+(canvasWidth*(SCALE-(1-SCALE))*(1-(n/90)));<br>'
  +'&emsp;&emsp;ay = canvasHeight*(1-SCALE)*(1-(n/45));</p>'

  var textAreaOne = $('<textarea spellcheck="false">by = canvasHeight-(canvasHeight*(SCALE)*(1-(n/45)));</textarea>');

  var textTwo = $('<p>&emsp;&emsp;cy = canvasHeight*(1-SCALE)+(canvasHeight*(1-SCALE)*(n/45));<br>'
  +'&emsp;&emsp;dy = canvasHeight*SCALE-(canvasHeight*(1-SCALE)*(n/45));<br>'
  +'&emsp;}<br>'
  +'&emsp;<span class="comment">//and for the second half of the turn (45-90deg)</span><br>'
  +'&emsp;else if (n >= 45) {<br>'
  +'&emsp;&emsp;ax = bx = canvasWidth-(canvasWidth*(1-SCALE)*((n-45)/45));<br>'
  +'&emsp;&emsp;cx = dx = (canvasWidth*(1-SCALE))+(canvasWidth*(SCALE-(1-SCALE))*(1-(n/90)));<br>'
  +'&emsp;&emsp;ay = canvasHeight*(1-SCALE)*((n-45)/45);<br>'
  +'&emsp;&emsp;by = canvasHeight-(canvasHeight*(1-SCALE)*((n-45)/45));<br>'
  +'&emsp;&emsp;cy = canvasHeight*(1-SCALE)+(canvasHeight*(2*(1-SCALE))*(1-(n/90)));<br>'
  +'&emsp;&emsp;dy = canvasHeight*SCALE-(canvasHeight*(2*(1-SCALE))*(1-(n/90)));<br>'
  +'&emsp;}<br>}<br><br>'
  +'<span class="comment">//move keypoints if spinning counter clockwise</span><br>'
  +'else {<br>'
  +'&emsp;<span class="comment">//for the first half of the turn (0-45deg)...</span><br>'
  +'&emsp;if (n < 45) {<br>'
  +'&emsp;&emsp;ax = bx = (canvasWidth*(1-SCALE))+(canvasWidth*(SCALE-(1-SCALE))*(n/90));<br>'
  +'&emsp;&emsp;cx = dx = (canvasWidth*(1-SCALE))-(canvasWidth*(1-SCALE)*(1-(n/45)))+(canvasWidth*(SCALE));<br>'
  +'&emsp;&emsp;ay = canvasHeight*(1-SCALE)+(canvasHeight*(1-SCALE)*(n/45));<br>'
  +'&emsp;&emsp;by = canvasHeight*SCALE-(canvasHeight*(1-SCALE)*(n/45));</p>');

  var textAreaTwo = $('<textarea spellcheck="false">cy = canvasHeight*(SCALE)*(1-(n/45));</textarea>');

  var textThree = $('<p>&emsp;&emsp;dy = canvasHeight-(canvasHeight*(1-SCALE)*(1-(n/45)));<br>&emsp;}<br>'
  +'&emsp;<span class="comment">//and for the second half of the turn (45-90deg)</span><br>'
  +'&emsp;else if (n >= 45) {<br>'
  +'&emsp;&emsp;ax = bx = (canvasWidth*(1-SCALE))+(canvasWidth*(SCALE-(1-SCALE))*(n/90));<br>'
  +'&emsp;&emsp;cx = dx = (canvasWidth*(1-SCALE)*((n-45)/45));<br>'
  +'&emsp;&emsp;ay = canvasHeight*(1-SCALE)+(canvasHeight*(2*(1-SCALE))*(1-(n/90)));<br>'
  +'&emsp;&emsp;by = canvasHeight*SCALE-(canvasHeight*(2*(1-SCALE))*(1-(n/90)));<br>'
  +'&emsp;&emsp;cy = canvasHeight*(1-SCALE)*((n-45)/45);<br>'
  +'&emsp;&emsp;dy = canvasHeight-(canvasHeight*(1-SCALE)*((n-45)/45));<br>'
  +'&emsp;}<br>}</p>');


  navyDialog.append(textOne);
  navyDialog.append(textAreaOne);
  navyDialog.append(textTwo);
  navyDialog.append(textAreaTwo);
  navyDialog.append(textThree);

  // Turn the element into a dialog with jQuery UI's .dialog()
  navyDialog.dialog({
    // Position it in the center of the the canvas
    position: {
      my: "center",
      at: "left+" + dialogx + " top+" + dialogy,
      of: "#canvas"
    },
    resizable: false,
    height: "auto",
    width: 700,
    modal: false,
    autoOpen: true,
    buttons: {
      "Fix": function () {
        $(this).dialog("close");
        if (textAreaOne.val() == 'by = canvasHeight-(canvasHeight*(1-SCALE)*(1-(n/45)));'
        && textAreaTwo.val() == 'cy = canvasHeight*(1-SCALE)*(1-(n/45));') {
          solved = true;
          room[35] = [null, 36, 34, null, 'navy'];
        }
        else {
          navy = false;
          console.log(navy);
        }
      }
    }
  }).css("font-size", "10px");

  //prevents highlighting of any of the buttons by default
  $('.ui-dialog :button').blur();
}

function end () {
  $('body').css({
    backgroundColor: 'white',
  });
  $('#canvas').css({
    visibility: 'hidden',
  });
  location.href = '../downloads/package03.zip';
  end = true;
  Gibber.clear();
}

function dialogBox (dialogTitle, dialogAlert, dialogButtonA, dialogButtonAResults, dialogButtonB, dialogButtonBResults) {
  var dialog = $('<div id="dialogBox" title="'+ dialogTitle +'"><p><span class="ui-icon ui-icon-alert" style="float: left; margin:12px 12px 20px 0;"></span>'+ dialogAlert +'<p></div>')
  var dialogx = canvasWidth/2;
  var dialogy = canvasHeight/2;

  var buttons = {};
  buttons[dialogButtonA] = dialogButtonAResults;
  buttons[dialogButtonB] = dialogButtonBResults;

  // Turn the element into a dialog with jQuery UI's .dialog()
  dialog.dialog({
    // Position it in the center of the the canvas
    position: {
      my: "center",
      at: "left+" + dialogx + " top+" + dialogy,
      of: "#canvas"
    },
    resizable: false,
    height: "auto",
    width: 400,
    modal: false,
    autoOpen: true,
    buttons,
  });

  //prevents highlighting of any of the buttons by default
  $('.ui-dialog :button').blur();
}

function codes () {
  var codeString = '';

  $(document).keypress(function (event) {
    codeString += event.key;
    //activate lantern
    if (codeString.indexOf("illuminate") != -1) {
      lanternActivated = true;
      $("#lights").css({visibility: 'visible'});
      pinkRoom();
    }

    //activate colour id tool
    if (codeString.indexOf("rgb") != -1) {
      colourIDActivated = true;
    }

    //activate compass
    if (codeString.indexOf("lost") != -1) {
      compassActivated = true;
      compass ();
    }

    //activate compass
    if (codeString.indexOf("room") != -1  && cheat != true) {
      r = 34;
      pr = 33;
      cheat = true;
    }
  });
}

//all of this remaining code is composed and written by Adrian Hu
function stageOneMusic () {
  Clock.rate = 0.6

  a = EDrums('x...ox.x....o...')
    a.snare.snappy = 1.5
    a.kick.decay = 0.3
    a.amp = 2

  b = Synth({ maxVoices:4, waveform:'Saw', attack:ms(200), decay:ms(3000) })
  c = FM('bass',{decay:ms(200)})
  d = Synth({ maxVoices:4, waveform:'Saw', attack:ms(10), decay:ms(3000) })

  score = Score([
  0, c.note.score( [],2 ),
  measures(1), function() {
    b.amp = 0.2
    c.amp = 2
    c.note.seq(['c2','eb2','c2','eb2'], [11/16,5/16])
    b.chord.seq(['c3m11', 'c3maj9','c3min9',],[3/2,1/2,2])
  },
  measures(4), function() {
    b.chord.seq(['e3min9'],1)
    c.note.seq(['e2'],[1.5/16,1.5/16,1.5/16,1.5/16,2/16])
  },
  measures(0.5), function() {
    c.note.seq(['c2','eb2','c2','eb2'], [11/16,5/16])
    b.chord.seq(['c3m11', 'c3maj9','c3min9',],[3/2,1/2,2])
  },
  measures(2), function() {
    b.chord.seq(['e3min9'],1)
    c.note.seq(['e2'],[1.5/16,1.5/16,1.5/16,1.5/16,2/16])
  },
  measures(0.5), function() {
    c.note.seq(['c2','eb2','c2','eb2'], [11/16,5/16])
    b.chord.seq(['c3m11', 'c3maj9','c3min9',],[3/2,1/2,2])
  },
  measures(2), function() {
    b.chord.seq(['e3min9'],1)
    c.note.seq(['e2'],[1.5/16,1.5/16,1.5/16,1.5/16,2/16])
  },
  measures(0.5), function() {
    c.note.seq(['c2','eb2','c2','eb2'], [11/16,5/16])
    b.chord.seq(['c3m11', 'c3maj9','c3min9',],[3/2,1/2,2])
  },
  measures(2), function() {
    b.chord.seq(['e3min9'],1)
    c.note.seq(['e2'],[1.5/16,1.5/16,1.5/16,1.5/16,2/16])
  },
  measures(0.5), function() {
    c.note.seq(['c2','eb2','c2','eb2'], [11/16,5/16])
    b.chord.seq(['c3m11', 'c3maj9','c3min9',],[3/2,1/2,2])
  },
  measures(2), function() {
    c.note.seq(['c2','c3','a#3','c3','f3','g3','a#2','c2'], [2/16,2/16,1/16,3/16,1/16,1/16,1/16,5/16])
  },
  ]).start()
}

function stageTwoMusic () {
  Clock.rate = 0.6

  a = EDrums('x**xo****-*-*-')
    .snare.snappy = 1
    .amp = 3

  b = Synth({ maxVoices:4, waveform:'Triangle', attack:ms(600), decay:ms(3000) })
  d = Synth({ maxVoices:4, waveform:'Saw', attack:ms(10), decay:ms(3000) })
  c = FM('bass',{decay:ms(400)})
  score = Score([
    0, c.note.score( [],1 ),
    measures(2), function() {
      b.amp = 0.5
      c.amp = 2
      d.amp = 0.1
      c.note.seq(['e2','d2','e2','e2','d2','e2','e1'], [1.5/14,1.5/14,11/14,1.5/14,1.5/14,1/14,10/14])
      b.chord.seq(['c3maj7', 'c#3min7','e3min7',],[4/7,3/7,1])
    },
    measures(4), function() {
      d.fx.add( Tremolo({ amp: 1, frequency:1.4 }) )
      b.chord.seq.stop()
      d.chord.seq([[],'e4min11'],[8/14,6/14])
      c.note.seq(['e1','e#1','e1'], [3/14,3/14,8/14])
    },
    measures(4), function() {
      d.chord.seq.stop()
      c.note.seq(['e2','d2','e2','e2','d2','e2','e1'], [1.5/14,1.5/14,11/14,1.5/14,1.5/14,1/14,10/14])
      b.chord.seq(['c3maj7', 'c#3min7','e3min7',],[4/7,3/7,1])
    },
    measures(8), function() {
      b.chord.seq.stop()
      d.chord.seq([[],'e4min11'],[8/14,6/14])
      c.note.seq(['e1','e#1','e1'], [3/14,3/14,8/14])
    },
  ]).start()
}

function stageThreeMusic () {
  Clock.rate = 0.6
  a = EDrums('x..x..x..*x*ox**')
    .fx.add( Reverb({ roomSize: 0.9 }) )
    .snare.snappy = 1
    .amp = 3

  b = FM('bass',{decay:ms(500)})
  c = Synth({ maxVoices:4, waveform:'Sine', attack:ms(10), decay:ms(1000) })

  score = Score([

    0, b.note.score( [],1 ),
    measures(1), c.chord.score( ['c3min7', 'c#3min7','d3min7',],[3/16,3/16,3/16,2/16,2/16,3/16] ),
    measures(2), b.note.score( ['d4','a4','d4','a3','d5'], [1.5/16,1.5/16,1.5/16,1.5/16,10/16] ),
    measures(2), c.chord.score( ['e3min7','a3min11',],[1,1] ),
    measures(2), function() {
      c.chord.seq( ['c4min7', 'c#4min7','d4min7',],[3/16,3/16,3/16,2/16,2/16,3/16] ),
      b.note.seq.stop()
      b.amp = 0.6
      b.note.seq( ['d2','c2','d2','d1'], [1/16,1/16,11/16,3/16] )
    },
    measures(2), function() {
      c.chord.seq( ['e3min7','a3min11',],[1,1] )
      b.amp = 0.4
      b.note.seq( ['d4','a4','d4','a3','d5'], [1.5/16,1.5/16,1.5/16,1.5/16,10/16] )
    },
    measures(2), function() {
      c.chord.seq( ['c4min7', 'c#4min7','d4min7',],[3/16,3/16,3/16,2/16,2/16,3/16] ),
      b.note.seq.stop()
      b.amp = 0.6
      b.note.seq( ['d2','c2','d2','d1'], [1/16,1/16,11/16,3/16] )
    },
    measures(4), function() {
      c.chord.seq( ['e3min7','a3min11',],[1,1] )
      b.amp = 0.4
      b.note.seq( ['d4','a4','d4','a3','d5'], [1.5/16,1.5/16,1.5/16,1.5/16,10/16] )
    },
    measures(2), function() {
      c.chord.seq( ['c3min7', 'c#3min7','d3min7',],[3/16,3/16,3/16,2/16,2/16,3/16] ),
      b.note.seq.stop()
      b.amp = 0.6
      b.note.seq( ['d2','c2','d2','d1'], [1/16,1/16,11/16,3/16] )
    },
  ]).start()
}

function limeMusic () {
  Clock.rate = 0.6

  b = FM('bass',{decay:ms(500)})
  b.amp = 0.6
  c = Synth({ maxVoices:6, waveform:'Sine', attack:ms(100), decay:ms(1500) })
  d = FM('bass',{attack:ms(100),decay:ms(500)})
  d.fx.add( Reverb({ roomSize: 0.95 }))


  score = Score([

    0, c.chord.score( ['c5maj6','c5min6','c5min6','f4maj9','f4min9'],[3/11,1/11,1/11,3/11,3/11] ),
    // measures(2), function() {
    //   b.note.seq(['c2','c2','f1','f1','f1','f1'],  [1.5/11,3.5/11,1.5/11,1.5/11,1.5/11,1.5/11] )
    //   c.chord.seq( ['c4maj6','c4min6','c4min6','f3maj9','f3min9'],[3/11,1/11,1/11,3/11,3/11] )
    // },
    measures(2), function() {
      a = EDrums('x........x**x**x........o........')
      a.kick.decay = 0.3
      a.snare.snappy = 2
      // a.fx.add( Reverb({ roomSize: 0.6 }) )
      b.note.seq(['c2','c2'],  [1.5/11,9.5/11] )
      c.chord.seq( ['c4maj6','d#3maj9','c3maj6','d#3maj9'],[9.5/11,1.5/11] )
      d.chord.seq(['c5maj6','c5maj6','c5maj6','c4maj6','c4maj6','c4maj6'],[0.75/11,0.75/11,9.5/11,0.75/11,0.75/11,9.5/11])
    },


  ]).start()
}
