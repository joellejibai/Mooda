import React from 'react';
import { useNavigate } from 'react-router-dom'; // import navigate hook

const tips = [
  {
    title: 'Accessorize',
    description:
      "If it’s a casual set, go for more laid-back accessories like a cross body bag. If it’s a dressy set up, dress it up with statement jewelry.",
    direction: 'normal',
  },
  {
    title: 'Shoes',
    description:
      "Depending on the style of the set you can choose different shoes to match. For example, sandals or sneakers can be great for casual setting.",
    direction: 'reverse',
  },
  {
    title: 'Hairstyles',
    description:
      "Harmonizing your hairstyles with your outfits can take your outfits from nice to top-notch. This will make you look more classy and confident when you venture out.",
    direction: 'normal',
  },
];

const FashionTips = () => {
  const navigate = useNavigate(); // initialize navigation

  const handleNavigate = () => {
    navigate('/moretips'); // replace with your route
  };

  return (
    <div className="fashion-tips-wrapper">
      <div className="glass-title">
        <h2 className="fashion-tips-title">Fashion Tips</h2>
      </div>

      <div className="fashion-tips-box">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={`tip-row ${tip.direction === 'reverse' ? 'reverse-row' : ''}`}
          >
            <div className="circle-tip">{tip.title}</div>
            <p>{tip.description}</p>
          </div>
        ))}
      </div>

      {/* Navigation button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handleNavigate} className="navigate-button">
          Learn More Tips
        </button>
      </div>
    </div>
  );
};

export default FashionTips;
