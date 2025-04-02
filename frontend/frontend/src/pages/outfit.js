import React from 'react';
import { useNavigate } from 'react-router-dom';

const Outfit = () => {
  const navigate = useNavigate();

  // Function to handle Go Back button click
  const handleGoBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  return (
    <div className="outfit-container"> 
      {/* Go Back Button */}
      <button className="virtual-go-back-button" onClick={handleGoBack}>
        <img src="/back.png" alt="Go Back" className="go-back-icon" />
      </button>

      <div className="smallGlass">
        <h2>Outfit Recommendation</h2>
      </div>

      <div className="virtual-container1">
        {/* Categories with Left and Right Arrows */}
        <div className="virtual-category-container">
          <img src="/left.png" alt="Left" className="side-icon left-icon" />
          <div className="virtual-category-item1">Top</div>
          <img src="/right.png" alt="Right" className="side-icon right-icon" />
        </div>

        <div className="virtual-category-container">
          <img src="/left.png" alt="Left" className="side-icon left-icon" />
          <div className="virtual-category-item1">Bottom</div>
          <img src="/right.png" alt="Right" className="side-icon right-icon" />
        </div>

        <div className="virtual-category-container">
          <img src="/left.png" alt="Left" className="side-icon left-icon" />
          <div className="virtual-category-item2">Foot</div>
          <img src="/right.png" alt="Right" className="side-icon right-icon" />
        </div>
      </div>

      {/* Proceed Button at the Bottom */}
      <div className="bottom-button-container">
        <button className="proceed-button">AUTO-GENERATE</button>
      </div>
    </div>
  );
};

export default Outfit;
