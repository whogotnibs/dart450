

const TOTAL_IMAGES = randomIntegerInRange(0,100);
var farquad = '<img class="image farquad" src="images/farquad.jpg">';
var shrek = '<img class="image shrek" src="images/shrek.jpg">';


$(document).ready(function() {

  for (var i = 0; i < TOTAL_IMAGES; i++) {
    var img = placeImage();
    $('body').append(img);
  }

  $('.image').click(imageClicked);
})



function placeImage() {

  var img = randomImageGen();

  var imageX = randomIntegerInRange(0,$(document).width());
  var imageY = randomIntegerInRange(0,$(document).height());

  img.css({
    top: imageY + 'px',
    left: imageX + 'px'
  });

  randomRotate(img,-30,30);

  return img;
}




function randomImageGen () {

  var r = Math.random();
  if (r < 0.05) {
    return $(shrek);
  }
  else {
      return $(farquad);
  }}




function randomRotate(element,min,max) {

  rotation = randomIntegerInRange(min,max);

  element.css({
    "transform": "rotateZ(" + rotation + "deg)"
  });

}




function randomIntegerInRange(min,max) {
  return Math.floor(Math.random() * (max - min)) + min;

}




function imageClicked() {
  var r = Math.random();
  if (r < 0.5) {
    $('.image').hide();
  }
  else {
      $('.farquad').attr({
        src: 'images/donkey.jpg',
        class: 'image donkey'
      });

      $('.shrek').attr({
        src: 'images/prince.jpg',
        class: 'image prince'
      });
  }

};
