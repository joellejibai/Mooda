import React, { useState } from 'react';
import './DressUp'; // Ensure the correct file path4
import { useNavigate } from 'react-router-dom';

const DressUp = () => {
    const navigate = useNavigate();
    const tips = [
        
        {
            title: 'Outfit Recommendation',
            path: '/outfit',
            icon: '/outfit.png',
        }
    ];

    return (
        <div className="backgroundStyle1">
            <div className="smallGlass">
            <h2>DressUp</h2>
            </div>
            <div className="DressUp-list">
                {tips.map((tip, index) => (
                    <div 
                        key={index} 
                        className="DressUp-card" 
                        onClick={() => navigate(tip.path)}
                        style={{ cursor: 'pointer' }} 
                    >
                        <img src={tip.icon} alt={tip.title} className="DressUp-icon" />
                        <h3>{tip.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default DressUp;
