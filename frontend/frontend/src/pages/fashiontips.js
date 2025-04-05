import React from 'react';

const FashionTips = () => {
  return (
    <div className="fashion-tips-wrapper">
      {/* Light glass title box */}
      <div className="smallGlass lighter-glass">
        <h2 className="fashion-tips-title">Fashion Tips</h2>
      </div>

      <div className="fashion-tips-box">

        {/* Tip 1 - Normal */}
        <div className="tip-row">
          <div className="circle-tip">Accessorize</div>
          <p>
            For example, if it’s a casual set, go for more laid-back accessories like a cross body bag.
            If it’s a dressy set up, dress it up with statement jewelry.
          </p>
        </div>

        {/* Tip 2 - Reversed */}
        <div className="tip-row reverse-row">
          <div className="circle-tip">Shoes</div>
          <p>
            Depending on the style of the set you can choose different shoes to match.
            For example, sandals or sneakers can be great for casual setting.
          </p>
        </div>

        {/* Tip 3 - Normal */}
        <div className="tip-row">
          <div className="circle-tip">Hairstyles</div>
          <p>
            Harmonizing your hairstyles with your outfits can take your outfits from nice to top-notch.
            This will make you look more classy and confident when you venture out.
          </p>
        </div>

      </div>
    </div>
  );
};

export default FashionTips;
