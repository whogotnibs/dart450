/*

Title Blasting
Thomas Bell

using blast to reveal the title of my final assignment letter by letter.

each click on the page brings the zindex of the next letter to the top.
this reflects the idea of discovering something in a 3d environment.
(something to expect in my final assignment)

*/
var z = 0;
var chars = [];
var currentIndex = 0;

$(document).ready(function() {

  //blast the title into characters
  $('#blastbycharacter').blast({
    delimiter: 'character'
  }).each(addToArray);

  //update the next character in the blast
  $(document).click(function() {
    moveUp ();
  });

});

//add each index in blast to the array of all the characters
function addToArray () {
  chars.push($(this));
}

function moveUp () {
  //move it to the front
  z = currentIndex+1;

  //update the rgb values based on the current index to cycle through different colours
  var redValue = currentIndex*(250/($('.blast').length));
  var greenValue = currentIndex*(250/($('.blast').length));
  var blueValue = 250-currentIndex*(250/($('.blast').length));


  console.log(z + ',' + redValue + ',' + greenValue + ',' + blueValue);

  chars[currentIndex].css({
    'z-index': z,
    'color': 'rgb('+redValue+','+greenValue+','+blueValue+')',
  });

  //go to the next index in the blast
  currentIndex++;
  //stop at the end
  if (currentIndex == chars.length) {
    currentIndex = chars.length - 1;
  }
}
