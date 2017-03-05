/*

3d Maze
Thomas Bell

*/

var orientation = 0;
const SPIN_DEG = 90;


$(document).ready(function() {

spin ();

compass ();

});

function spin () {
  $(document).keydown(function (event){
    //if the left arrow key is pressed down spin left
    if (event.which == 37) {
      orientation = orientation - SPIN_DEG;
    }

    //if the right arrow key is pressed down spin right
    else if (event.which == 39) {
      orientation = orientation + SPIN_DEG;
    }

    //loop the orientation at 360 to mimick spinning a full 360 deg
    if (orientation >= 361) {
      orientation = 0 + SPIN_DEG;
    }
    else if (orientation <= -1) {
      orientation = 360 - SPIN_DEG;
    }
    else if (orientation == 360) {
      orientation = 0;
    }

    console.log(orientation);
  });
}

function compass () {

}
