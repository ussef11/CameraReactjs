import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import Switch from "./media/switch.png"
import Camera from "./media/camera.png"

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

  console.log(facingMode + videoConstraints);

  return (
    <>
      <div className="webcam-container">
        <div className="webcam-img">
      <div style={{textAlign:"center"}}>  <img   onClick={handleClick}  src={Switch}  /></div> 
          {img === "" ? (
      <>      <Webcam
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
       

        {img && <button onClick={downloadImage}>Download</button>}

        
      </div>
    </>
  );
}
