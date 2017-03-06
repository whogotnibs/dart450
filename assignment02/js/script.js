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

//a counter variable that will be used to stop spinning after 90deg
var n = 0;

//making a global variable for the spinning interval
//this way it can be cleared with clearInterval(spinning)
var spinning;


$(document).ready(function() {

spin ();

});

//a function that lets you spin 90deg (either direction) with the arrow keys
function spin () {
  $(document).keydown(function (event){

    //dont allow the user to start a new spinning interval if they are
    //already spinning
    if (n > 0) {}

    //if the left arrow key is pressed down spin counter clockwise
    else if (event.which == 37) {
      spinning = setInterval(spinCounterClockwise, SPIN_INT);
    }

    //if the right arrow key is pressed down spin clockwise
    else if (event.which == 39) {
      spinning = setInterval(spinClockwise, SPIN_INT);
    }
  });
}

function spinCounterClockwise () {

  //subtract from the current orientation...
  orientation = orientation - SPIN_DEG;
  //and add that same difference to the counter
  n = n + SPIN_DEG;

  //loop the orientation at 360deg as it approaches 0 or 360
  checkLoop ();

  //rotate the compass based on the current orientation
  compass ();

  //log the new orientation
  console.log(orientation);

  //stop spinning when the counter reaches 90 (N, E, S, or W)
  if (n >= 90) {

    //clear the spinning interval...
    clearInterval(spinning);
    //then reset the counter...
    n = 0;
    //and log the orientation that the player is now facing
    console.log(orientation + 'done spin');
  }
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
  console.log(orientation);

  //stop spinning when the counter reaches 90 (N, E, S, or W)
  if (n >= 90 / SPIN_DEG) {

    //clear the spinning interval...
    clearInterval(spinning);
    //then reset the counter...
    n = 0;
    //and log the orientation that the player is now facing
    console.log(orientation + 'done spin');
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
}

//a function that rotates the compass based on the orientation
function compass () {
  $('.compass').css({

    //the compass needs to rotate the opposite direction
    //than the player is spinning
    transform: 'rotate('+ (360 - orientation) +'deg)'
  });
}
