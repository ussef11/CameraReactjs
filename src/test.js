import React, { useEffect, useState } from "react";

const Test = () => {
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const videoRef = React.useRef(null);

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
                facingMode: "environment",
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

  return (
    <div>
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
    </div>
  );
};

export default Test;
