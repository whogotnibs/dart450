/*

Rectangles Speeding Up
Thomas Bell

When you click anywhere on the page rectangles fall down the screen. The colour
of each rectangle is randomly selected from an array. Each new array of
rectangles moves at 2x the speed of the previous.

Get the speed up high for interesting update effects.

*/
var rectangles = [];

// Here is the speed they fall at (pixels per frame)
const FALL_SPEED = 10;

// Number of rectangles to display
const NUM_RECTANGLES = 10;

// A place to store the window height
var windowHeight;

// An array to store the possible rectangle colours
var color = ['lightblue', 'beige', 'grey', 'pink', 'lightgreen'];

// start function on click
$(document).click(function() {

  // Storing the window height in a variable
  windowHeight = $(window).height();

  // First we create an array to store our rectangles
  rectangles = new Array(NUM_RECTANGLES);

  // Now we loop through the (empty) array, putting rectangles in it
  for (var i = 0; i < NUM_RECTANGLES; i++) {

    // Make a rectangle (set its position based on i, its
    // location in the array so they're in different places)
    var rect = rectangle(100 + i*100, -10, 50, 50);

    // Put it in the array
    rectangles[i] = rect;

    // Add it to the HTML
    $('body').append(rectangles[i]);
  }

  // Request animation frame so that our update function starts
  window.requestAnimationFrame(update);
});


// update()
//
// This is a function called once per animation frame on the page
// In this case we're using it to animate our rectangles down
// the page
function update() {

  // Use a for loop to go through the rectangles array from
  // start to end
  for (var i = 0; i < rectangles.length; i++) {

    // Update the current rectangle's y position with the fall speed
    // each new rectangle array will have double the fall speed of the previous
    rectangles[i].y += FALL_SPEED;

    // Check if the current rectangle would go off the bottom
    // of the window
    if (rectangles[i].y > windowHeight) {

      // If so, set its location to just above the top of the window
      rectangles[i].y = -rectangles[i].h;
    }

    // Set the rectangle's transform, so it moves on the page itself
    // We tranlate the rectangle to the location we've stored for it
    rectangles[i].css({
      transform: 'translate(' + rectangles[i].x + 'px, ' + rectangles[i].y + 'px)'
    });
  }

  // And then we request the next animation frame to do all this again
  window.requestAnimationFrame(update);
}

// rectangle(x, y, w, h)
//
// A simple function to create a filled div with absolute position
// at location x, y and with dimensions of w by h
//
// Returns the div created as a jQuery object
function rectangle (x, y, w, h) {
  // First we create the div that will be the rectangle using jQuery
  var rect = $('<div></div>'); 

  // We can store properties in our rectangle object by just adding
  // them explicitly.
  rect.x = x;
  rect.y = y;
  rect.w = w;
  rect.h = h;

  //using the math library to randomly select a colour from the color array
  var randomColor = color[Math.floor(Math.random() * color.length)];


  // Then we set up the CSS of the div so that it looks like a rectangle
  // in the location we want it.
  //
  // Using transform's translate() this time, instead of .offset()
  // or the left/top CSS properties
  rect.css({ 
    position: 'absolute',
    width: rect.w + 'px',
    height: rect.h + 'px', 
    transform: 'translate(' + rect.x + 'px, ' + rect.y + 'px)',

    // including the random colour variable
    backgroundColor: randomColor
  }); 


  // Finally, we RETURN the div we created from the function
  // So that whoever called this function can do something with it
  return rect;
}
