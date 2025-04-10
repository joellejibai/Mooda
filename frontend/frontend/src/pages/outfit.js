import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthPages } from "../hooks/useAuthPages";

const Outfit = () => {
  const navigate = useNavigate();
  const { user } = useAuthPages();
  const location = useLocation();

  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [footwear, setFootwear] = useState([]);

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [footIndex, setFootIndex] = useState(0);

  const topGroup = ["tshirt", "sweater", "hoodie", "top", "jacket", "dress"];
  const bottomGroup = ["pants", "jeans", "shorts"];
  const footGroup = ["boots", "sneakers", "heels", "shoes"];

  const selectedTopId = location.state?.selectedTopId || null;
  const selectedBottomId = location.state?.selectedBottomId || null;
  const selectedFootwearId = location.state?.selectedFootwearId || null;

  // Fetch items based on categories
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        console.log(data);  // Log to ensure we are getting the data

        // Filter items by category
        const topsList = data.filter(item => topGroup.includes(item.category?.toLowerCase()));
        const bottomsList = data.filter(item => bottomGroup.includes(item.category?.toLowerCase()));
        const footwearList = data.filter(item => footGroup.includes(item.category?.toLowerCase()));

        console.log("Tops: ", topsList.length);
        console.log("Bottoms: ", bottomsList.length);
        console.log("Footwear: ", footwearList.length);

        setTops(topsList);
        setBottoms(bottomsList);
        setFootwear(footwearList);

        // Preselect items if IDs are available
        if (selectedTopId) {
          const index = topsList.findIndex(item => item._id === selectedTopId);
          if (index !== -1) setTopIndex(index);
        }

        if (selectedBottomId) {
          const index = bottomsList.findIndex(item => item._id === selectedBottomId);
          if (index !== -1) setBottomIndex(index);
        }

        if (selectedFootwearId) {
          const index = footwearList.findIndex(item => item._id === selectedFootwearId);
          if (index !== -1) setFootIndex(index);
        }

      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    if (user) fetchItems();
  }, [user, selectedTopId, selectedBottomId, selectedFootwearId]);

  const handleGoBack = () => navigate(-1);

  // Function to navigate through items (top, bottom, footwear)
  const slide = (type, direction) => {
    if (type === "top") {
      setTopIndex(prev => (prev + direction + tops.length) % tops.length);
    } else if (type === "bottom") {
      setBottomIndex(prev => (prev + direction + bottoms.length) % bottoms.length);
    } else if (type === "foot") {
      setFootIndex(prev => (prev + direction + footwear.length) % footwear.length);
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
          <img src="/left.png" alt="Left" className="side-icon left-icon" onClick={() => slide("top", -1)} />
          <div className="virtual-content-box">
            {tops.length > 0 && tops[topIndex]?.image && (
              <img src={tops[topIndex].image} alt="Top" className="outfit-preview-image" />
            )}
          </div>
          <img src="/right.png" alt="Right" className="side-icon right-icon" onClick={() => slide("top", 1)} />
        </div>

        {/* BOTTOM */}
        <div className="virtual-category-container">
          <img src="/left.png" alt="Left" className="side-icon left-icon" onClick={() => slide("bottom", -1)} />

          {bottoms.length > 0 && bottoms[bottomIndex]?.image && (
            <img src={bottoms[bottomIndex].image} alt="Bottom" className="outfit-preview-image" />
          )}
          <img src="/right.png" alt="Right" className="side-icon right-icon" onClick={() => slide("bottom", 1)} />
        </div>

        {/* FOOT */}
        <div className="virtual-category-container">
          <img src="/left.png" alt="Left" className="side-icon left-icon" onClick={() => slide("foot", -1)} />

          {footwear.length > 0 && footwear[footIndex]?.image && (
            <img src={footwear[footIndex].image} alt="Foot" className="outfit-preview-image" />
          )}
          <img src="/right.png" alt="Right" className="side-icon right-icon" onClick={() => slide("foot", 1)} />
        </div>
      </div>

      <div className="bottom-button-container">
        <button className="proceed-button">AUTO-GENERATE</button>
      </div>
    </div>
  );
};

export default Outfit;