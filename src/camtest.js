import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import Switch from "./media/switch.png";
import Camera from "./media/camera.png";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

export default function Camtest() {
  const webcamRef = useRef(null);
  const videoRef = useRef(null);
  const [img, setImg] = useState("");
  const [facingMode, setFacingMode] = useState(FACING_MODE_ENVIRONMENT);
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

  const getVideoConstraints = useCallback(() => {
    return {
      facingMode: facingMode,
      height: 720,
      audio: true,
      frameRate: 30,
      advanced: [{ torch: torchOn }],
    };
  }, [facingMode, torchOn]);

  const handleClick = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);

  useEffect(() => {
    // Check if the torch feature is supported by the device
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment", advanced: [{ torch: true }] } })
      .then(() => setTorchSupported(true))
      .catch(() => setTorchSupported(false));
  }, []);

  const handleToggleTorch = () => {
    setTorchOn((prevTorchOn) => !prevTorchOn);
  };

  return (
    <>
      <div className="webcam-container">
        <div className="webcam-img">
          <video
            ref={videoRef}
            autoPlay
            style={{ display: "none" }}
          ></video>
          <div style={{ textAlign: "center" }}>
            <img onClick={handleClick} src={Switch} alt="Switch Camera" />
          </div>
          {img === "" ? (
            <>
              <Webcam
                className="webcam"
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={getVideoConstraints()}
                screenshotQuality={1}
                scale={5}
                style={{ width: "100%" }}
              />
              <div style={{ textAlign: "center" }}>
                <img
                  className="dd"
                  onClick={capture}
                  src={Camera}
                  alt="Capture Image"
                />
              </div>
            </>
          ) : (
            <>
              <img
                src={img}
                alt="Scan"
                style={{ width: "100%", height: "auto" }}
              />
              <div style={{ textAlign: "center" }}>
                <img
                  className="dd"
                  onClick={() => setImg("")}
                  src={Camera}
                  alt="Capture Image"
                />
              </div>
            </>
          )}
        </div>

        {torchSupported && (
          <button onClick={handleToggleTorch}>
            {torchOn ? "Turn Off Torch" : "Turn On Torch"}
          </button>
        )}

        {img && <button onClick={downloadImage}>Download</button>}
      </div>
    </>
  );
}
