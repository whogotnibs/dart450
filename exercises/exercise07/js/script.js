/*

Exercise 7
Thomas Bell

scroll down on the page to adjust the colour of the box on the right
the aim is to match its colour to the box on the left
when you match the colour of the two boxes they will be happy and music will play

Uses:

ScrollMagic
http://scrollmagic.io/

TweenMax
https://greensock.com/tweenmax

*/

//the duration of the scene's above and below the key colour
//it should be large to make the animation slow
const SCENE_DUR = 45000;

var controller;

var aboveKeyColour;

var belowKeyColour;

$(document).ready(function() {

  // Create a ScrollMagic Controller so we can use the library
  controller = new ScrollMagic.Controller();

  // Create a new scene for scrolling above the key colour
  // Use a duration so that the animations are tied to scroll speed
  aboveKeyColour = new ScrollMagic.Scene({
    //based on the trigger
    triggerElement: "#trigger",
    duration: SCENE_DUR
  });

  // creating a second scene for scrolling below the key colour
  belowKeyColour = new ScrollMagic.Scene({
    triggerElement: "#trigger",
    duration: SCENE_DUR
  });

  //a function animating the colour's blue value from 255 to 128
  above ();

  //a function animating the colour's blue value from 128 to 0
  below ();

  //a function that shows/hides a smiley face and plays music
  //during the small gap inbetween the two scenes (while the colours are the same)
  smile ();

});


function above () {
  // using tween to animate the colour of the second box closer to the target colour
  // while the user scrolls through the first trigger.
  aboveKeyColour.setTween("#changingbox", 0.5, {
    "backgroundColor": "rgb(255,218,128)"
  });

  aboveKeyColour.triggerHook(0.5);

  // Add the debugging indicators so we can see what's happening
  // aboveKeyColour.addIndicators();

  // Add our scene to the controller so it actually does something
  aboveKeyColour.addTo(controller);
}


function below () {
  //offset the starting position of the second scene (below the key colour)
  //duration of the first scene + 700
  //this creates gap between the two scenes approaching/leaving the target colour
  belowKeyColour.offset(SCENE_DUR + 700);

  //animates with tween, the colour away from the target colour
  //only the blue value gets adjused
  belowKeyColour.setTween("#changingbox", 0.5, {
    "backgroundColor": "rgb(255,218,0)"
  });

  belowKeyColour.triggerHook(0.5);

  // Add the debugging indicators so we can see what's happening
  // belowKeyColour.addIndicators();

  // Add our scene to the controller so it actually does something
  belowKeyColour.addTo(controller);
}


function smile () {
  var song = document.getElementsByClassName("music")[0];

  //leaving the first trigger
  aboveKeyColour.on("leave", function (e) {
    $('p').css({
      visibility: 'visible'
    });
    song.play();
  });

  //returning to the first trigger
  aboveKeyColour.on("enter", function (e) {
    $('p').css({
      visibility: 'hidden'
    });
    song.pause();
  });

  //entering the second trigger
  belowKeyColour.on("enter", function (e) {
    $('p').css({
      visibility: 'hidden'
    });
    song.pause();
  });

  //leaving the second trigger
  belowKeyColour.on("leave", function (e) {
    $('p').css({
      visibility: 'visible'
    });
    song.play();
  });
}
