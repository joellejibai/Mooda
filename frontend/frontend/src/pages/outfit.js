import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthPages } from "../hooks/useAuthPages";

const Outfit = () => {
  const navigate = useNavigate();
  const { user } = useAuthPages();

  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [footwear, setFootwear] = useState([]);

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [footIndex, setFootIndex] = useState(0);

  const topGroup = ["tshirt", "sweater", "hoodie", "top", "jacket"];
  const bottomGroup = ["pants", "jeans", "shorts"];
  const footGroup = ["boots", "sneakers", "heels", "shoes"];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();
        console.log("Fetched items:", data); // ✅ ADD THIS

        if (!response.ok) throw new Error(data.message);

        setTops(data.filter(item => topGroup.includes(item.category?.toLowerCase())));
        setBottoms(data.filter(item => bottomGroup.includes(item.category?.toLowerCase())));
        setFootwear(data.filter(item => footGroup.includes(item.category?.toLowerCase())));
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    if (user) fetchItems();
  }, [user]);


  const handleGoBack = () => navigate(-1);

  const slide = (type, direction) => {
    if (type === "top") {
      setTopIndex((prev) => (prev + direction + tops.length) % tops.length);
    } else if (type === "bottom") {
      setBottomIndex((prev) => (prev + direction + bottoms.length) % bottoms.length);
    } else if (type === "foot") {
      setFootIndex((prev) => (prev + direction + footwear.length) % footwear.length);
    }
  };

  return (
    <div className="outfit-container">
      <button className="virtual-go-back-button" onClick={handleGoBack}>
        <img src="/back.png" alt="Go Back" className="go-back-icon" />
      </button>

      <div className="smallGlass">
        <h2>Outfit Recommendation</h2>
      </div>

      <div className="virtual-container1">
        {/* TOP */}
        <div className="virtual-category-container">
          <div className="virtual-category-item1">
            <p className="category-title">Top</p>
            <div className="image-slider">
              <img src="/left.png" alt="Left" className="side-icon left-icon" onClick={() => slide("top", -1)} />
              {tops.length > 0 && tops[topIndex]?.image && (
                <img src={tops[topIndex].image} alt="Top" className="outfit-preview-image" />
              )}
              <img src="/right.png" alt="Right" className="side-icon right-icon" onClick={() => slide("top", 1)} />
            </div>
          </div>
        </div>



        {/* BOTTOM */}
        {/* <div className="virtual-category-container">
          <img src="/left.png" alt="Left" className="side-icon left-icon" onClick={() => slide("bottom", -1)} />
          <div className="virtual-category-item1">Bottom</div>
          {bottoms.length > 0 && bottoms[bottomIndex] && bottoms[bottomIndex].image && (
            <img src={bottoms[bottomIndex].image} alt="Bottom" className="outfit-preview-image" />
          )}
          <img src="/right.png" alt="Right" className="side-icon right-icon" onClick={() => slide("bottom", 1)} />
        </div> */}

        <div className="virtual-category-container">
          <div className="virtual-category-item1">
            <p className="category-title">Bottom</p>
            <div className="image-slider">
              <img src="/left.png" alt="Left" className="side-icon left-icon" onClick={() => slide("bottom", -1)} />
              {bottoms.length > 0 && bottoms[bottomIndex]?.image && (
                <img src={bottoms[bottomIndex].image} alt="Bottom" className="outfit-preview-image" />
              )}
              <img src="/right.png" alt="Right" className="side-icon right-icon" onClick={() => slide("bottom", 1)} />
            </div>
          </div>
        </div>


        {/* FOOT */}
        {/* <div className="virtual-category-container">
          <img src="/left.png" alt="Left" className="side-icon left-icon" onClick={() => slide("foot", -1)} />
          <div className="virtual-category-item2">Foot</div>
          {footwear.length > 0 && footwear[footIndex] && footwear[footIndex].image && (
            <img src={footwear[footIndex].image} alt="Foot" className="outfit-preview-image" />
          )}
          <img src="/right.png" alt="Right" className="side-icon right-icon" onClick={() => slide("foot", 1)} />
        </div> */}

        <div className="virtual-category-container">
          <div className="virtual-category-item1">
            <p className="category-title">Foot</p>
            <div className="image-slider">
              <img src="/left.png" alt="Left" className="side-icon left-icon" onClick={() => slide("foot", -1)} />
              {footwear.length > 0 && footwear[footIndex]?.image && (
                <img src={footwear[footIndex].image} alt="Foot" className="outfit-preview-image" />
              )}
              <img src="/right.png" alt="Right" className="side-icon right-icon" onClick={() => slide("foot", 1)} />
            </div>
          </div>
        </div>

      </div>

      <div className="bottom-button-container">
        <button className="proceed-button">AUTO-GENERATE</button>
      </div>
    </div>
  );
};

export default Outfit;
