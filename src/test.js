import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import Switch from "./media/switch.png"

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

export default function Test() {
  const webcamRef = useRef(null);
  const [img, setImg] = useState("");
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

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
    width: 270,
    height: 480
  };

  const handleClick = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);

  console.log(facingMode + videoConstraints);

  return (
    <>
      <div className="webcam-container">
        <div className="webcam-img">
        {img === null ? (
        <>
          <Webcam
            audio={false}
            mirrored={true}
            height={400}
            width={400}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
          <button onClick={capture}>Capture photo</button>
        </>
      ) : (
        <>
          <img src={img} alt="screenshot" />
          <button onClick={() => setImg(null)}>Retake</button>
        </>
      )}
        </div>
        
        {img && <button onClick={downloadImage}>Download</button>}
        <button onClick={handleClick}>Switch camera</button>
      </div>
    </>
  );
}
