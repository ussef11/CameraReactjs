import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import Switch from "./media/switch.png"
import Camera from "./media/camera.png"

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

export default function Camtest() {
  const webcamRef = useRef(null);
  const videoRef = useRef(null);
  const [img, setImg] = useState("");
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
  }, []);

  const downloadImage = () => {
    if (img) {
      const a = document.createElement("a");
      a.href = img;
      a.download = "captured_image.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const videoConstraints = {
    facingMode: facingMode,

    height: 720,
    audio:true,

    frameRate: 30,
    advanced: [{ torch: true }]

  };

  const handleClick = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );

  }, []);

  useEffect(() => {
    
    const SUPPORTS_MEDIA_DEVICES = "mediaDevices" in navigator;

    if (SUPPORTS_MEDIA_DEVICES) {
     
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const cameras = devices.filter(
            (device) => device.kind === "videoinput"
          );

          if (cameras.length === 0) {
            console.log("No camera found on this device.");
          }

          // Create stream and get video track
          navigator.mediaDevices
            .getUserMedia({
              video: {
                facingMode: facingMode,
              },
            })
            .then((stream) => {
              webcamRef.current.srcObject = stream;

              // Check if torch is supported
              const supportedTorch = !!stream.getVideoTracks()[0].applyConstraints;
              setTorchSupported(supportedTorch);
              console.log(supportedTorch)
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("MediaDevices not supported in this browser.");
    }
  }, []);

  const handleToggleTorch = () => {
    const videoTrack = videoRef.current.srcObject?.getVideoTracks()[0];

    if (videoTrack && torchSupported) {
      try {
        videoTrack.applyConstraints({
          advanced: [{ torch: !torchOn }],
        });
        setTorchOn(!torchOn);
      } catch (err) {
        console.log(err);
      }
    }
  };


  console.log(facingMode + videoConstraints);

  return (
    <>
      <div className="webcam-container">
        <div className="webcam-img">
      <div style={{textAlign:"center"}}>  <img   onClick={handleClick}  src={Switch}  /></div> 
          {img === "" ? (
      <>  
         <video 
        ref={videoRef}
        autoPlay
        style={{display:"none" }}
      ></video>
      
          <Webcam
              className="webcam"
              audio={false}
              ref={webcamRef}
              screensshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              screenshotQuality={1}
              scale={5}

              style={{width:"100%"}}
             
            />
            <div style={{textAlign:"center"}}>      <img  className="dd" onClick={capture}  src={Camera}  /> </div>  </> 
          ) : (
            <> 
            <img
              src={img}
              alt="Scan"
              style={{ width: "100%", height: "auto" }}
            />
      
            
      <div style={{textAlign:"center"}}> <img  className="dd" onClick={() => setImg("")} src={Camera}  /> </div>
            
            </>
          )}
        </div>
        {torchSupported ? (
        <button onClick={handleToggleTorch}>
          {torchOn ? "Turn Off Torch" : "Turn On Torch"}
        </button>
      ) : (
        <p>No torch found</p>
      )}

        {img && <button onClick={downloadImage}>Download</button>}

        
      </div>
    </>
  );
}
