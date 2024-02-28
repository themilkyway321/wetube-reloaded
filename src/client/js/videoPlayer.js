console.log("video player");


const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue = 0.5;
video.volume = volumeValue;

let controlsTimeout = null;
let controlsMovementTimeout = null;

const handlePlayClick = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
  };

  const handleMuteClick = () => {
    if(video.muted){
        video.muted = false;
    }else{
        video.muted= true;
    }
    muteBtnIcon.classList = video.muted? "fas fa-volume-mute": "fas fa-volume-up";
    volumeRange.value = video.muted? 0: 0.5
  };

const handleVolumeChange =(event)=>{
    const {
        target:{value},
    }= event;

    video.volume = value;
    if (Number(value) === 0) {
        muteBtnIcon.classList = "fas fa-volume-mute";
        video.muted = true;
        } else {
        video.muted = false;
        muteBtnIcon.classList = "fas fa-volume-up";
        }
  }

  const formatTime = (seconds) => {
    const startIdx = seconds >= 3600 ? 11 : 14;
    return new Date(seconds * 1000).toISOString().substring(startIdx, 19);
    };


  const handleLoadedMetadata  = ()=>{
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
  }
  const handleTimeUpdate = ()=>{
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
    if(timeline.value=== timeline.max){
        playBtnIcon.classList ="fas fa-arrow-rotate-right";
    }
  }
const handleTimelineChange = (event)=>{
    const {
        target:{value},
    }= event;
    if (!video.paused) {
        playBtnIcon.classList ="fas fa-play";
        video.pause();
        }
    video.currentTime = value;
}
const handleTimelineSet = () => {
    video.play();
    playBtnIcon.classList = "fas fa-pause";
    };

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();

        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
};
const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }// 마우스가 비디오에서 떠났을 때 controlsTimeout 초기화 시키기 
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
      }// 마우스가 비디오안에서 움직일때마다 초기화 된다. 

    videoControls.classList.add("showing");
    // 마우스가 비디오안에서 움직일때마다 타임아웃값이 다시 생긴다. 
    controlsMovementTimeout = setTimeout(hideControls, 3000); // 마우스가 비디오안에서 움직임을 멈췄을 때, 타임아웃
    
};
const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000); //setTimeout은 브라우저로 부터 id를 부여받는다 

    controlsTimeout = setTimeout(hideControls, 3000); // 비디오에서 떠나면 controlsTimeout에 id값이 생겨나고, 컨트롤은 3초있다가 제거 
    console.log(controlsMovementTimeout);
};

const handleKeydown = (event) => {
    console.log(event);
    if (event.code === "Space" && event.target.id !== "textarea") {
    handlePlayClick();
    event.preventDefault();
    }
    };

    const handleEnded = () => {
        const { id } = videoContainer.dataset;
        fetch(`/api/videos/${id}/view`, {
          method: "POST",
        });
      };

  playBtn.addEventListener("click", handlePlayClick);
  muteBtn.addEventListener("click", handleMuteClick);
  volumeRange.addEventListener("input",handleVolumeChange);
  video.addEventListener("loadedmetadata", handleLoadedMetadata );
  video.addEventListener("timeupdate", handleTimeUpdate );
  video.addEventListener("ended", handleEnded);
  timeline.addEventListener("input", handleTimelineChange);
  timeline.addEventListener("change", handleTimelineSet);
  fullScreenBtn.addEventListener("click", handleFullscreen);
  videoContainer.addEventListener("mousemove", handleMouseMove);
  videoContainer.addEventListener("mouseleave", handleMouseLeave);
  video.addEventListener("click", handlePlayClick);
  document.addEventListener("keydown", handleKeydown);