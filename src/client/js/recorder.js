import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
    input:"recording.webm",
    output:"output.mp4",
    thumb:"thumbnail.jpg",
}

const downloadFile = (fileUrl, fileName)=>{;
    const a = document.createElement("a");
    a.href=fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}

const handleDownload = async()=>{

    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerHTML="Downloading....";
    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({
        corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
        log: true
        });
    await ffmpeg.load(); //ffmpeg 실행 

    //가상 컴퓨터에서 recording.webm이라는 파일 생성 
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    //60프레임 mp4영상으로 변환
    await ffmpeg.run("-i", files.input, "-r", "60", files.output);

    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);
    
    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile",files.thumb );

    const mp4Blob = new Blob([mp4File.buffer],{type:"video/mp4"});
    const thumbBlob = new Blob([thumbFile.buffer],{type:"image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);


    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(thumbUrl, "MyThumbnail.jpg");
   


    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);
    
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);


    actionBtn.disabled = false;
    actionBtn.innerHTML="Record again";
    actionBtn.addEventListener("click", handleStart);

};


const handleStart = ()=>{
    actionBtn.innerText = "Recording";
    actionBtn.disabled = true;
    actionBtn.addEventListener("click", handleDownload);
    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    

    //recorder.stop()일때 발생하는 이벤트 
    recorder.ondataavailable = (event)=>{
    videoFile = URL.createObjectURL(event.data);//브라우저가 생성한 파일 주소 
    video.srcObject = null; //비디오 프리뷰(미리보기)를 없애고
    video.src = videoFile;
    video.loop = true;
    video.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
        }

    // 녹화 시작
    recorder.start();
    //5초후 중단 
    setTimeout(() => {
        recorder.stop();
      }, 5000);

};



const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: 1024,
            height: 576,
          },
        audio:false,
    })

    //실시간으로 재생 
    video.srcObject = stream; 
    video.play();
}

init();
actionBtn.addEventListener("click", handleStart);