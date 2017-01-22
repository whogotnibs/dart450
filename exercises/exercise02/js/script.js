$(document).ready(function() {
  var interval = 150;
  var opacity = .3;
  var opacityDecrease = .02;
  var opacityIncrease = .03;
  var size = 5;
  var sizeDecrease = .2;
  var sizeIncrease = .3;

  $('body').keypress(function () {
    opacity -= opacityDecrease;
    size -= sizeDecrease;


    if (opacity <= 0) {
      opacity = 0;
      opacityIncrease = false;
      $('#fire').css({
        "display": "none"
      });
      $('#win').css({
        "display": "block"
      });
    }
  });


  setInterval(function (int) {

    opacity += opacityIncrease;
    size += sizeIncrease;

    if (opacity >= 1) {
      opacity = 1;
      opacityDecrease = false;
      $('#fire').css({
        "display": "none"
      });
      $('#lose').css({
        "display": "block"
      });
    }


    var textColor = "rgba(255,0,0," + opacity + ")"

    $('#fire').css({
      "color": textColor
    });

    var textSize = "" + size + "em"

    $('#fire').css({
      "font-size": textSize
    });
  },interval);
});
