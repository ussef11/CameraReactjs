import React, { useEffect, useRef, useState  , useCallback} from "react";

import Switch from "./media/switch.png"
import Camera from "./media/camera.png"

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const TorchControl = () => {
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);
  useEffect(() => {
    // Test browser support for mediaDevices
    const SUPPORTS_MEDIA_DEVICES = "mediaDevices" in navigator;

    if (SUPPORTS_MEDIA_DEVICES) {
      // Get the environment camera (usually the second one)
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
              videoRef.current.srcObject = stream;

              // Check if torch is supported
              const supportedTorch = !!stream.getVideoTracks()[0].applyConstraints;
              setTorchSupported(supportedTorch);
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
  }, [facingMode]);

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

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setCapturedImage(canvas.toDataURL("image/jpeg"));
  };

  const handleDownload = () => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.href = capturedImage;
      link.download = "captured_image.jpg";
      link.click();
    }
  };

  const handleClick = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );

  }, []);

  return (
    <div>
         <div style={{textAlign:"center"}}>  <img   onClick={handleClick}  src={Switch}  /></div> 
      <video
        ref={videoRef}
        autoPlay
        style={{ width: "100%", height: "auto" }}
      ></video>
      {torchSupported ? (
        <button onClick={handleToggleTorch}>
          {torchOn ? "Turn Off Torch" : "Turn On Torch"}
        </button>
      ) : (
        <p>No torch found</p>
      )}

      <button onClick={handleCapture}>Capture</button>
      {capturedImage && (
        <>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "100%", height: "auto" }}
          />
          <button onClick={handleDownload}>Download</button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default TorchControl;
