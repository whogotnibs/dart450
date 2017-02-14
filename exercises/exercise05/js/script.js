
var desiredKey = -1;
// up, left, down, right (in that order)
var keyCode = [38, 37, 40, 39]
var key = [0, 1, 2, 3]
var specify = [
  'higher',
  'to the left',
  'a little lower',
  'to the right'
]

$(document).ready(function () {

  desiredKey = chooseRandomKey();

  setTimeout('responsiveVoice.speak("would you touch my arrow keys, please", "UK English Female", {pitch: .2, rate: .8})', 500);

  $(document).keyup(handleKeyUp)

});

function handleKeyUp(event) {

  if (desiredKey == -1) {
    return;
  }

  if (event.which == keyCode[desiredKey]) {
    responsiveVoice.speak("that's the spot", "UK English Female", {pitch: .2, rate: .8})
    desiredKey = -1;
    setTimeout(function () {
      desiredKey = chooseRandomKey();
      responsiveVoice.speak("again", "UK English Female", {pitch: .2, rate: .8})
    },2500);
  }

  else {
    specifyKey();
  }

}

function chooseRandomKey() {
  //use the math library to select a random arrow key
  desiredKey = key[Math.floor(Math.random() * key.length)];
  return desiredKey;
}

function specifyKey() {
  responsiveVoice.speak(specify[desiredKey], "UK English Female", {pitch: .2, rate: .8})
}
