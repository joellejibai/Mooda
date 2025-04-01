import React, { useState } from 'react';
import './virtual'; // Ensure the correct file path4
import { useNavigate } from 'react-router-dom';

const virtual = () => {
    const navigate = useNavigate();
    const tips = [
        {
          title: 'Virtual Try-Ons', path: '/home' 
          
        },
        {
          title: 'Outfit Recommendation', path: '/home' 
          
        },
        {
          title: 'Event Outfit Planning', path: '/home' 
          
        },
      ];
    
      return (
        <div className="DressUp-container">
            <h2>DressUp</h2>
            <div className="DressUp-list">
                {tips.map((tip, index) => (
                    <div 
                        key={index} 
                        className="DressUp-card" 
                        onClick={() => navigate(tip.path)}
                        style={{ cursor: 'pointer' }} // Make it clear it's clickable
                    >
                        <h3>{tip.title}</h3>
                    </div>
                ))}
            </div>
        </div>
      );
    };
export default virtual;
