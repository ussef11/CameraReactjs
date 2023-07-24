import React, { useEffect, useRef, useState } from "react";
import Test from "./test";
import "./App.css";
import Videotest from "./videotest"
import Camtest from "./camtest"
const App = () => {
  const [position, setPosition] = useState([]);
  const [displayCam, setDisplayCam] = useState(true);
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const stripRef = useRef(null);
  const colorRef = useRef(null);

  const [capt , setcapt] = useState("capture")
  const [recording, setRecording] = useState(false);
const mediaRecorderRef = useRef(null);
const chunksRef = useRef([]);

const handleaction = ()=>{
  

}

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setPosition(pos);

          console.log(pos);
        },
        function () {
          alert("Please  Active your GPS and  Try againe") 
          window.location.reload()  
             }
      );
    } else {
      // Browser doesn't support Geolocation
      alert("your Browset doesn't  support geolocation  Please change it")
    }
  }, []);


 
  const getVideo = (facingMode ) => {
    console.log(facingMode)
    navigator.mediaDevices
    .getUserMedia({
      video: { facingMode: { exact: facingMode }, width: 300 },
    })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
  
        // Set up MediaRecorder
        const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };
        mediaRecorder.onstop = () => {
          const videoBlob = new Blob(chunksRef.current, { type: "video/webm" });
          chunksRef.current = [];
          const videoUrl = URL.createObjectURL(videoBlob);
          const link = document.createElement("a");
          link.href = videoUrl;
          link.download = "myWebcamVideo.mp4";
          link.click();
          URL.revokeObjectURL(videoUrl);
          const vid = document.getElementById("vid")
          vid.innerHTML =`<video src='${videoUrl}' />`
        };
       
        mediaRecorderRef.current = mediaRecorder;
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err.name, err.message);
      });
  };



  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const paintToCanvas = () => {
    let video = videoRef.current;
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");

    const width = 320;
    const height = 240;
    photo.width = width;
    photo.height = height;

    return setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height);
    }, 200);
  };

  const handleRecord = () => {
    if (recording) {
      mediaRecorderRef.current.stop();
    } else {
      chunksRef.current = [];
      mediaRecorderRef.current.start();
    }
    setRecording(!recording);
  };

  
  const stop = () => {
    let video = videoRef.current;
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());

    video.srcObject = null;
    setDisplayCam(false);
  };

  const takePhoto = () => {
    let photo = photoRef.current;
    let strip = stripRef.current;

    const data = photo.toDataURL("image/jpeg");

    const link = document.getElementById("a");
    link.href = data;
    link.setAttribute("download", "myWebcam");
    link.download = "myWebcam.png"; // Changed the file extension to ".png"
    link.click();
    link.innerHTML = `<img src='${data}' alt='thumbnail'/>`;
    strip.insertBefore(link, strip.firstChild);
    console.log(strip.firstChild)
  };

  const [facingMode, setFacingMode] = useState("environment"); 
  const toggleCamera = () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    getVideo(newFacingMode);
    // console.log(facingMode)
  
  };
  
const [video , setVideo] =  useState(false)
  return (
    <div>

      <h3>My Position:</h3>
      {position && (
        <div>
          <p>Lat: {position.lat}</p>
          <p>Lng: {position.lng}</p>
        </div>
      )}

      <div> 
        <button onClick={()=>{setVideo(false)}}>Photo</button>
        <button onClick={()=>{setVideo(true)}}>Video</button>
      </div>

      {/* <div className="webcam-video">
      <button onClick={toggleCamera}>Toggle Camera</button>

        <button onClick={() => takePhoto()}>Take a photo</button>
        <button onClick={() => handleRecord()}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
        {displayCam && (
          <>
            <video
              onCanPlay={() => paintToCanvas()}
              ref={videoRef}
              className="player"
            />
            <canvas style={{ display: "none" }} ref={photoRef} className="photo" />
          </>
        )}
        <div className="photo-booth">
          <div ref={stripRef} className="strip" />
        </div>
        <button onClick={() => stop()}>stop</button>
      </div>
      <a id="a"></a>

      <div id="vid"></div> */}
   
      {/*         <Test/>   */}
      <> 
{   video === false ?   <Camtest/>
    :  <Videotest/>    }
   
          </>


    </div>
  );
};

export default App;
