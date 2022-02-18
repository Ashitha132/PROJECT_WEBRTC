const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const toggleButton = document.getElementById('toggle-cam');
const toggleAudio = document.getElementById('toggle-audio');
const screenshare = document.getElementById('screen-share');
const buttoncopy=document.getElementById("copy-text");



    const copytext=ROOM_ID;

   
let userstream;



const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
  })
  const myVideo = document.createElement('video')

  const peers = {}




navigator.mediaDevices.getUserMedia({
    video: true,
     audio: true
    }).then(stream => {
        userstream=stream
       
        addVideoStream(myVideo,stream)

        myPeer.on('call', call => {
            call.answer(stream)
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
              addVideoStream(video, userVideoStream)
            })
          })

        socket.on('user-connected', userId => {
            connectToNewUser(userId, stream)
          })
    })





    socket.on('user-disconnected', userId => {
        if (peers[userId]) peers[userId].close()
      })


  myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
  })

  function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
  
    peers[userId] = call
  }


  toggleButton.addEventListener('click', () => {
    const videoTrack = userstream.getTracks().find(track => track.kind === 'video');
    if (videoTrack.enabled) {
        videoTrack.enabled = false;
        
        toggleButton.innerHTML = 'Show cam'
    } else {
        videoTrack.enabled = true;
        
        toggleButton.innerHTML = "Hide cam"
    }
});

toggleAudio.addEventListener('click', () => {
  const audioTrack = userstream.getTracks().find(track => track.kind === 'audio');
  if (audioTrack.enabled) {
    audioTrack.enabled = false;
    
      toggleAudio.innerHTML = 'Unmute'
  } else {
    audioTrack.enabled = true;
      toggleAudio.innerHTML = "Mute"
  }
});


screenshare.addEventListener('click',() =>{
  var constraints = {  audio: true, video: { width: 1280, height: 1280 } }; 
  

  navigator.mediaDevices.getDisplayMedia(constraints)
  .then(function(mediaStream) {
    
    myVideo.srcObject = mediaStream;
    myVideo.onloadedmetadata = function(e) {
      myVideo.play();
      getUserMediaSuccess(myVideo.srcObject)  
    };
  })
  .catch(function(err) { console.log(err.name + ": " + err.message); });


})


buttoncopy.onclick=function(){
  var dummy = document.createElement('input'),
    text = window.location.href;

document.body.appendChild(dummy);
dummy.value = text;
dummy.select();
document.execCommand('copy');
document.body.removeChild(dummy);

document.getElementById("alarmmsg").innerHTML = "url copied !";

setTimeout(function(){
    document.getElementById("alarmmsg").innerHTML = '';
}, 3000);
  


}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }