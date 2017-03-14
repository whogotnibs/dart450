/*

Title Blasting
Thomas Bell

using blast to reveal the title of my final project letter by letter.
this reflects
*/
var z = 0;

$(document).ready(function() {

  $('#blastbycharacter').blast({
    delimiter: 'character'
  }).each(moveUp);

});

function moveUp (index) {

  var element = $(this);
  setTimeout(function () {
    z = index+1;

    var redValue = index*(250/($('.blast').length));
    var greenValue = index*(250/($('.blast').length));
    var blueValue = 250-index*(250/($('.blast').length));


    console.log(z + ',' + redValue + ',' + greenValue + ',' + blueValue);

    element.css({
      'z-index': z,
      'color': 'rgb('+redValue+','+greenValue+','+blueValue+')',
    });
  },index*1200);
}
