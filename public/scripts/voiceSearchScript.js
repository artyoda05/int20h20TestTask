URL = window.URL
var gumStream;
//stream from getUserMedia() 
var rec;
//Recorder.js object 

var recSection = document.getElementById('recordingSection');
var uplSection = document.getElementById('uploadSection');

var input;
const recorder = document.getElementById('recorder');
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var uploadButton = document.getElementById("uploadButton");
var audioFileForm = document.getElementById("audioFile");

var AudioContext = window.AudioContext

recordButton.disabled = false;
stopButton.disabled = true;

var constraints = {
    audio: true,
    video: false
}
function startRecording() {
    var audioContext = new AudioContext;
    recordButton.disabled = true;
    stopButton.disabled = false;
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
        /* assign to gumStream for later use */
        gumStream = stream;
        console.log(stream)
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);
        /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
        rec = new Recorder(input, {
            numChannels: 1
        })
        //start the recording process 
        rec.record()
        console.log("Recording started");
    }).catch(function (err) {
        //enable the record button if getUserMedia() fails 
        recordButton.disabled = false;
        stopButton.disabled = true;
    });
}

function stopRecording() {
    console.log("stopButton clicked");
    //disable the stop button, enable the record too allow for new recordings 
    stopButton.disabled = true;
    recordButton.disabled = false;
    //tell the recorder to stop the recording 
    rec.stop(); //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink 
}

function uploadRecording() {
    rec.exportWAV(uploadAudioToServer);
}

function uploadAudioToServer(blob) {
    var filename = new Date().toISOString();
    var xhr=new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		      }
		  };
    var fd = new FormData();
    fd.append("audio_data", blob, filename);
    xhr.open("POST", "post adress" /* Insert post address */, true);
    xhr.send(fd);
}

function showRecordSection() {
    
    recSection.hidden = false;
    uplSection.hidden = true;
}

function showFileSection() {
    recSection.hidden = true;
    uplSection.hidden = false;
}
