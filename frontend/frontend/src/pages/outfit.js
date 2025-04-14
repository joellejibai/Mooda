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

  const topGroup = ["tshirt", "sweater", "hoodie", "top", "jacket", "dress", "crop-top", "tank-top"];
  const bottomGroup = ["pants", "jeans", "shorts", "skirt", "sweatpants", "trousers", "skort", "leggings"];
  const footGroup = ["boots", "sneakers", "heels", "shoes"];

  const selectedTopId = location.state?.selectedTopId || null;
  const selectedBottomId = location.state?.selectedBottomId || null;
  const selectedFootwearId = location.state?.selectedFootwearId || null;

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

        const topsList = data.filter(item => topGroup.includes(item.category?.toLowerCase()));
        const bottomsList = data.filter(item => bottomGroup.includes(item.category?.toLowerCase()));
        const footwearList = data.filter(item => footGroup.includes(item.category?.toLowerCase()));

        setTops(topsList);
        setBottoms(bottomsList);
        setFootwear(footwearList);

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

  const slide = (type, direction) => {
    if (type === "top") {
      setTopIndex(prev => (prev + direction + tops.length) % tops.length);
    } else if (type === "bottom") {
      setBottomIndex(prev => (prev + direction + bottoms.length) % bottoms.length);
    } else if (type === "foot") {
      setFootIndex(prev => (prev + direction + footwear.length) % footwear.length);
    }
  };

  const handleAutoGenerate = async () => {
    try {
      const interval = setInterval(() => {
        setTopIndex(Math.floor(Math.random() * tops.length));
        setBottomIndex(Math.floor(Math.random() * bottoms.length));
        setFootIndex(Math.floor(Math.random() * footwear.length));
      }, 100);

      const response = await fetch(`/api/recommendations/ml/${user._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();
      if (data.error) throw new Error("ML Error: " + data.error);

      const topItem = data.recommended_wardrobe.find(item =>
        ["top", "tshirt", "hoodie", "sweater", "jacket", "crop-top", "tank-top", "dress"].includes(item.category?.toLowerCase())
      );
      const bottomItem = data.recommended_wardrobe.find(item =>
        ["pants", "jeans", "shorts", "skirt", "trousers", "leggings", "sweatpants"].includes(item.category?.toLowerCase())
      );
      const footItem = data.recommended_wardrobe.find(item =>
        ["foot", "sneakers", "boots", "heels", "shoes"].includes(item.category?.toLowerCase())
      );

      setTimeout(() => {
        clearInterval(interval);

        const fallbackMatch = (arr, category) =>
          arr.findIndex(item => item.category?.toLowerCase() === category?.toLowerCase());

        let topIdx = tops.findIndex(item => item._id === topItem?._id);
        if (topIdx === -1) topIdx = fallbackMatch(tops, topItem?.category);

        let bottomIdx = bottoms.findIndex(item => item._id === bottomItem?._id);
        if (bottomIdx === -1) bottomIdx = fallbackMatch(bottoms, bottomItem?.category);

        let footIdx = footwear.findIndex(item => item._id === footItem?._id);
        if (footIdx === -1) footIdx = fallbackMatch(footwear, footItem?.category);

        if (topIdx !== -1) setTopIndex(topIdx);
        if (bottomIdx !== -1) setBottomIndex(bottomIdx);
        if (footIdx !== -1) setFootIndex(footIdx);

        if (topIdx === -1 || bottomIdx === -1 || footIdx === -1) {
          alert("We couldn't create a full outfit. Try uploading more tops, bottoms, or shoes!");
        }
      }, 1500);
    } catch (err) {
      console.error("Failed to auto-generate outfit:", err);
      alert(err.message || "Something went wrong while generating your outfit.");
    }
  };

  const handleSeeLook = () => {
    navigate("/virtual", {
      state: {
        topImage: tops[topIndex]?.image,
        bottomImage: bottoms[bottomIndex]?.image,
        footImage: footwear[footIndex]?.image,
      },
    });
  };

  const handleSaveOutfit = async () => {
    try {
      const topId = tops[topIndex]?._id;
      const bottomId = bottoms[bottomIndex]?._id;
      const footId = footwear[footIndex]?._id;

      const response = await fetch('/api/saved-outfits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ top: topId, bottom: bottomId, foot: footId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert('✨ Outfit saved successfully!');
      navigate('/savedOutfits');
    } catch (err) {
      console.error('Failed to save outfit:', err);
      alert("❌ Could not save outfit");
    }
  };

  return (
    <div className="outfit-container">
      

      <div className="smallGlass">
        <h2>Outfit Recommendation</h2>
      </div>

      <div className="virtual-container1" style={{ position: "relative" }}>
        {/* Top */}
        <div className="virtual-category-container">
          <img src="/left.png" alt="Left" className="side-icon left-icon" onClick={() => slide("top", -1)} />
          <div className="virtual-content-box">
            {tops.length > 0 && tops[topIndex]?.image && (
              <img src={tops[topIndex].image} alt="Top" className="outfit-preview-image" />
            )}
          </div>
          <img src="/right.png" alt="Right" className="side-icon right-icon" onClick={() => slide("top", 1)} />
        </div>

        {/* Bottom */}
        <div className="virtual-category-container">
          <img src="/left.png" alt="Left" className="side-icon left-icon" onClick={() => slide("bottom", -1)} />
          {bottoms.length > 0 && bottoms[bottomIndex]?.image && (
            <img src={bottoms[bottomIndex].image} alt="Bottom" className="outfit-preview-image" />
          )}
          <img src="/right.png" alt="Right" className="side-icon right-icon" onClick={() => slide("bottom", 1)} />
        </div>

        {/* Footwear */}
        <div className="virtual-category-container">
          <img src="/left.png" alt="Left" className="side-icon left-icon" onClick={() => slide("foot", -1)} />
          {footwear.length > 0 && footwear[footIndex]?.image && (
            <img src={footwear[footIndex].image} alt="Foot" className="outfit-preview-image" />
          )}
          <img src="/right.png" alt="Right" className="side-icon right-icon" onClick={() => slide("foot", 1)} />
        </div>
      </div>

      {/* Buttons */}
      <div className="outfit-button-wrapper">
        <button className="auto-btn" onClick={handleAutoGenerate}>
          AUTO-GENERATE
        </button>

        <div className="action-btn-row">
          <button className="action-btn" onClick={handleSeeLook}>
            See How It Looks
          </button>
          <button className="action-btn" onClick={handleSaveOutfit}>
              Save This Outfit
          </button>
        </div>
      </div>

    </div>
  );
};

export default Outfit;
