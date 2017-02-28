// A webpage that is scared of people
// It will only come out of hiding (display its content) when no one is around



// How often to check for whether we've lost the face...
const INTERVAL = 100;
// How long the page will wait before displaying the webcam video
const MAX_TIME_SINCE_FACE = 1000;
// Track how long it has been since the page has seen a face,
// start on a high value so it assumes it hasn't seen one for a long time
var timeSinceFace = 1000000;


$(document).ready(function() {

  // Do the getUserMedia stuff
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  if (navigator.getUserMedia) {      
    navigator.getUserMedia({video: true}, handleVideo, videoError);
  }
});

// handleVideo (stream)
//
// When getUserMedia gets hold of the user's webcam, it calls this function
// with the argument "stream" which is the stream of the webcam data
function handleVideo(stream) {
  // First get the URL of the stream
  var streamURL = window.URL.createObjectURL(stream);
  // Now hold of the element on the page that can contain the video
  // (the video element with id 'webcam') and set its src attribute
  // to the URL we created for the stream...
  $('#webcam').attr({
    src: streamURL
  });
  // And now that the webcam is available, we can start actually tracking
  startTracking();
}

// videoError (e)
//
// If there's a problem with getting the webcam, this will get called.
// For now it just sets the background color to red to show something
// went wrong. Not very sophisticated.
function videoError(e) {
  $('body').css({
    'background-color': 'red'
  })
}

// startTracking()
//
// Called when webcam is available. Sets up the face tracking.
function startTracking() {

  // Make a face tracker...
  var faceTracker = new tracking.ObjectTracker(['face']);

  // Set up the function to call each frame while tracking
  faceTracker.on('track', handleTrackingEvent);

  // Start tracking
  tracking.track('#webcam', faceTracker);

  // Also start an interval function that will check if the webcam should be displayed
  setInterval(checkCam,INTERVAL);
}

//
// Called every INTERVAL - updates the page content based on
// when it last saw our face...
function checkCam () {
  // Update our variable tracking how long it's been since we saw a face...
  timeSinceFace += 100;
  // Note this is set back to 0 every frame that the tracker detects a face.

  // Check whether it's been too long since we saw a face
  if (timeSinceFace > MAX_TIME_SINCE_FACE) {
    console.log('show webcam')
    // If so, show the webcamfeed
    $('#webcam').css({
      visibility: 'visible'
    });
  }
}

// handleTrackingEvent
//
// Called every frame of video that detection is running
function handleTrackingEvent (event) {
  // Check if anything was tracked (a face)
  if (event.data.length === 0) {
    console.log('...')
    // No faces were detected in this frame.
  }
  else {
    console.log('a face!')
    // We found a face!
    // Reset the time since we saw a face to 0
    timeSinceFace = 0;
    //hide the webcam feed
    $('#webcam').css({
      visibility: 'hidden'
    });
  }
}
