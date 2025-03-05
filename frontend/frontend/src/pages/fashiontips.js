import React from 'react';
import './fashiontips'; // Import the CSS file for styling

const FashionTips = () => {
  const tips = [
    {
      title: 'Layering is Key',
      description: 'Layering your clothes can help you adjust to varying temperatures while still looking fashionable. Try combining jackets, cardigans, and scarves to add texture and dimension to your outfit.'
    },
    {
      title: 'Accessorize Wisely',
      description: 'Accessories can elevate any outfit. A statement necklace, watch, or pair of sunglasses can make a big impact without overdoing it.'
    },
    {
      title: 'Mix Patterns and Textures',
      description: 'Don’t be afraid to mix different patterns and textures, like floral with stripes or leather with lace. Just make sure the colors complement each other for a cohesive look.'
    },
    {
      title: 'Know Your Fit',
      description: 'The fit of your clothes is crucial to looking good. Ensure your clothes are not too tight or too loose. Aim for a fit that complements your body type for a polished look.'
    },
    {
      title: 'Dress for the Occasion',
      description: 'Always consider the occasion when picking out your outfit. Whether it’s casual, formal, or somewhere in between, dressing appropriately for the event shows respect and thoughtfulness.'
    }
  ];

  return (
    <div className="fashion-tips-container">
      <h2>Fashion Tips</h2>
      <div className="tips-list">
        {tips.map((tip, index) => (
          <div key={index} className="tip-card">
            <h3>{tip.title}</h3>
            <p>{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FashionTips;
