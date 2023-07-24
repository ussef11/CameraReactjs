import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

export default function Camtest() {
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
          {img === "" ? (
            <Webcam
              className="webcam"
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              screenshotQuality={1}
            />
          ) : (
            <> 
            <img
              src={img}
              alt="Scan"
              style={{ width: "500px", height: "auto" }}
            />
            <button onClick={() => setImg("")}>Retake</button></>
          )}
        </div>
        <button onClick={capture}>Capture</button>
        {img && <button onClick={downloadImage}>Download</button>}
        <button onClick={handleClick}>Switch camera</button>
      </div>
    </>
  );
}
