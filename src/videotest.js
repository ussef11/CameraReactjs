import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import Play from "./media/video.png"
import Stop from "./media/stop.png"
import Switch from "./media/switch.png"

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

export default function Videotest() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const videoConstraints = {

  
    facingMode: facingMode,
  };

  const handleClick = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );

  }, []);

  return (
    <div className="Container">
      <Webcam
       
        style={{width:"100%"}}
        audio={true}
        mirrored={false}
        ref={webcamRef}
        videoConstraints={videoConstraints}
      />
      {capturing ? (
       
        <img  onClick={handleStopCaptureClick}  src={Stop}  />
      ) : (
   
        <img   onClick={handleStartCaptureClick }  src={Play}  />
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
    
      )}

          <img   onClick={handleClick}  src={Switch}  />
    </div>
  );
}