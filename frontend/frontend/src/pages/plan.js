import React, { useState } from 'react';
import './plan';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam'; // Import Webcam component

const Plan = () => {
  const navigate = useNavigate();

  // State to hold the captured image
  const [photo, setPhoto] = useState(null);

  // Function to handle the click event for taking a photo
  const handleCapture = (image) => {
    setPhoto(image); // Store the captured image
  };

  const handleVirtualFitClick = () => {
    navigate('/virtual-fit');
  };

  // Function to handle Go Back button click
  const handleGoBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  return (
    <div> {/* This is the parent wrapper */}
      {/* Go Back Button */}
      <button className="virtual-go-back-button" onClick={handleGoBack}>
        <img src="/back.png" alt="Go Back" className="go-back-icon" />
      </button>

      <div className="smallGlass">
        <h2>Event Outfit Planning</h2>
      </div>

      <div className="virtual-container">
        {/* Categories container */}
        <div className="virtual-category-container">
          <div className="virtual-category-item">Full body</div>
          <div className="virtual-category-item">Upper body</div>
          <div className="virtual-category-item">Lower Body</div>
          <div className="virtual-category-item">Foot</div>
        </div>

        {/* Camera container in the center */}
        <div className="camera-container">
          <Webcam
            audio={false}
            height="auto"
            width="100%"
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "user", // Use the front camera
            }}
          />
          <button 
            className="virtual-capture-button" 
            onClick={() => handleCapture(document.querySelector('video').getScreenshot())}
          >
            Capture
          </button>
        </div>

        {/* Display captured image */}
        {photo && (
          <div className="captured-photo">
            <h3>Captured Photo:</h3>
            <img src={photo} alt="Captured" />
          </div>
        )}

        {/* Virtual Fit button */}
        <button className="virtual-fit-button" onClick={handleVirtualFitClick}>
          <span className="virtual-plus-icon">+</span> Virtual Fit
        </button>
      </div>
    </div>
  );
};

export default Plan;
