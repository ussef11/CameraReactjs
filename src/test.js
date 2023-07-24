import React, { useState, useRef, useCallback } from "react";

export default function WebcamCapture() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [img, setImg] = useState("");
  const [facingMode, setFacingMode] = useState("user");
  const [flashOn, setFlashOn] = useState(false);

  const capture = useCallback(() => {
    const video = webcamRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Get the image data from the canvas and set it in state
      const imageSrc = canvas.toDataURL("image/jpeg");
      setImg(imageSrc);
    }
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

  const handleClick = useCallback(() => {
    setFacingMode((prevState) => (prevState === "user" ? "environment" : "user"));
  }, []);

  const handleFlash = useCallback(() => {
    // Add code here to toggle flash
    // Note: Controlling the flash may not work in all environments
    setFlashOn((prevFlashOn) => !prevFlashOn);
  }, []);

  const constraints = {
    video: {
      facingMode: { exact: facingMode },
      width: 1280,
      height: 720,
      frameRate: 30,
      // Add flash control
      advanced: [{ torch: flashOn }]
    }
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      webcamRef.current.srcObject = stream;
    })
    .catch((error) => {
      console.error("Error accessing webcam:", error);
    });

  return (
    <>
      <div className="webcam-container">
        <div className="webcam-img">
          {img === "" ? (
            <video ref={webcamRef} autoPlay />
          ) : (
            <img src={img} alt="Scan" style={{ width: "500px", height: "auto" }} />
          )}
        </div>
        <button onClick={capture}>Capture</button>
        {img && <button onClick={downloadImage}>Download</button>}
        <button onClick={handleFlash}>
          {flashOn ? "Turn Flash Off" : "Turn Flash On"}
        </button>
        <button onClick={handleClick}>Switch camera</button>
      </div>
      {/* Hidden canvas to capture the image */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}
