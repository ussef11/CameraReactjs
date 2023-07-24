import React, { useEffect, useState } from "react";

const Test = () => {
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    // Test browser support for mediaDevices
    const SUPPORTS_MEDIA_DEVICES = "mediaDevices" in navigator;

    if (SUPPORTS_MEDIA_DEVICES) {
      // Get the environment camera (usually the second one)
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const cameras = devices.filter((device) => device.kind === "videoinput");

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
            const track = stream.getVideoTracks()[0];

            // Create image capture object and get camera capabilities
            const imageCapture = new ImageCapture(track);
            imageCapture
              .getPhotoCapabilities()
              .then((capabilities) => {
                // Check if torch is supported
                const supportedTorch =
                  !!capabilities.torch ||
                  ("fillLightMode" in capabilities &&
                    capabilities.fillLightMode.length !== 0 &&
                    capabilities.fillLightMode !== "none");

                setTorchSupported(supportedTorch);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } else {
      console.log("MediaDevices not supported in this browser.");
    }
  }, []);

  const handleToggleTorch = () => {
    try {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const cameras = devices.filter((device) => device.kind === "videoinput");
        const track = cameras[0]?.getVideoTracks()[0];

        if (track) {
          track.applyConstraints({
            advanced: [
              {
                torch: !torchOn,
              },
            ],
          });
          setTorchOn(!torchOn);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
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
