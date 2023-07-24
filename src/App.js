import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Videotest from "./videotest";
import Camtest from "./camtest";
import Test from "./test";
const App = () => {
  const [position, setPosition] = useState([]);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setPosition(pos);

          console.log(pos);
        },
        function () {
          alert("Please  Active your GPS and  Try againe");
          window.location.reload();
        }
      );
    } else {
      // Browser doesn't support Geolocation
      alert("your Browset doesn't  support geolocation  Please change it");
    }
  }, []);



  const [video, setVideo] = useState(false);
  return (
    <div>
      <h3>My Position:</h3>
      {position && (
        <div className="pos">
          <p style={{ marginRight: "23px" }}>Lat: {position.lat}</p>
          <p>Lng: {position.lng}</p>
        </div>
      )}

      <div>
        <button
          onClick={() => {
            setVideo(false);
          }}
          style={{ marginRight: "20px" }}
        >
          <span class="material-symbols-outlined">photo_camera</span>
        </button>
        <button
          onClick={() => {
            setVideo(true);
          }}
        >
          <span class="material-symbols-outlined">videocam</span>
        </button>
      </div>

      <>{video === false ? <Test /> : <Videotest />}</>
    </div>
  );
};

export default App;
