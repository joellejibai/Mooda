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
  const [reason, setReason] = useState(null);

  const topGroup = ["tshirt", "sweater", "hoodie", "top", "jacket", "dress", "crop-top", "tank-top"];
  const bottomGroup = ["pants", "jeans", "shorts", "skirt", "sweatpants", "trousers", "skort", "leggings"];
  const footGroup = ["boots", "sneakers", "heels", "shoes"];

  const selectedTopId = location.state?.selectedTopId || null;
  const selectedBottomId = location.state?.selectedBottomId || null;
  const selectedFootwearId = location.state?.selectedFootwearId || null;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const resp = await fetch("/api/items", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message);

        const topsList = data.filter(i => topGroup.includes(i.category?.toLowerCase()));
        const bottomsList = data.filter(i => bottomGroup.includes(i.category?.toLowerCase()));
        const footwearList = data.filter(i => footGroup.includes(i.category?.toLowerCase()));

        setTops(topsList);
        setBottoms(bottomsList);
        setFootwear(footwearList);

        if (selectedTopId) {
          const idx = topsList.findIndex(i => i._id === selectedTopId);
          if (idx !== -1) setTopIndex(idx);
        }
        if (selectedBottomId) {
          const idx = bottomsList.findIndex(i => i._id === selectedBottomId);
          if (idx !== -1) setBottomIndex(idx);
        }
        if (selectedFootwearId) {
          const idx = footwearList.findIndex(i => i._id === selectedFootwearId);
          if (idx !== -1) setFootIndex(idx);
        }
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    if (user) fetchItems();
  }, [user, selectedTopId, selectedBottomId, selectedFootwearId]);

  const slide = (type, dir) => {
    if (type === "top") setTopIndex(p => (p + dir + tops.length) % tops.length);
    if (type === "bottom") setBottomIndex(p => (p + dir + bottoms.length) % bottoms.length);
    if (type === "foot") setFootIndex(p => (p + dir + footwear.length) % footwear.length);
  };

  const handleAutoGenerate = async () => {
    let spinner;
    try {
      setReason(null);
      spinner = setInterval(() => {
        setTopIndex(Math.floor(Math.random() * tops.length));
        setBottomIndex(Math.floor(Math.random() * bottoms.length));
        setFootIndex(Math.floor(Math.random() * footwear.length));
      }, 100);

      const resp = await fetch(`/api/recommendations/ml/${user._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await resp.json();
      clearInterval(spinner);

      if (data.error) {
        alert(`💔 ${data.error}`);
        return;
      }

      const pick = (cats) => data.recommended_wardrobe.find(i => cats.includes(i.category?.toLowerCase()));
      const topItem = pick(topGroup);
      const bottomItem = pick(bottomGroup);
      const footItem = pick(footGroup);

      const fallback = (arr, cat) => arr.findIndex(i => i.category?.toLowerCase() === cat?.toLowerCase());
      let ti = tops.findIndex(i => i._id === topItem?._id);
      if (ti === -1) ti = fallback(tops, topItem?.category);

      let bi = bottoms.findIndex(i => i._id === bottomItem?._id);
      if (bi === -1) bi = fallback(bottoms, bottomItem?.category);

      let fi = footwear.findIndex(i => i._id === footItem?._id);
      if (fi === -1) fi = fallback(footwear, footItem?.category);

      if (ti !== -1) setTopIndex(ti);
      if (bi !== -1) setBottomIndex(bi);
      if (fi !== -1) setFootIndex(fi);

      if (data.reason) setReason(data.reason);

    } catch (err) {
      clearInterval(spinner);
      console.error(err);
      alert(err.message || "Something broke while generating!");
    }
  };

  const handleSeeLook = () => {
    navigate("/virtual", {
      state: {
        topImage: tops[topIndex]?.image,
        bottomImage: bottoms[bottomIndex]?.image,
        footImage: footwear[footIndex]?.image
      }
    });
  };

  const handleSaveOutfit = async () => {
    try {
      const body = {
        top: tops[topIndex]?._id,
        bottom: bottoms[bottomIndex]?._id,
        foot: footwear[footIndex]?._id
      };
      const resp = await fetch("/api/saved-outfits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      alert("✨ Outfit saved!");
      navigate("/savedOutfits");
    } catch (err) {
      console.error(err);
      alert("❌ Could not save outfit");
    }
  };

  return (
    <div className="outfit-container">
      {reason && (
        <div className="outfit-notif">
          <button onClick={() => setReason(null)}>✖</button>
          <h4>Stylist’s Take ✨</h4>
          <p>{reason}</p>
        </div>
      )}

      <div className="smallGlass"><h2>Outfit Recommendation</h2></div>
      <div className="virtual-container1">
        <div className="virtual-category-container">
          <img src="/left.png" onClick={() => slide("top", -1)} className="side-icon left-icon" />
          <div className="virtual-content-box">
            {tops[topIndex]?.image && <img src={tops[topIndex].image} className="outfit-preview-image" />}
          </div>
          <img src="/right.png" onClick={() => slide("top", 1)} className="side-icon right-icon" />
        </div>
        <div className="virtual-category-container">
          <img src="/left.png" onClick={() => slide("bottom", -1)} className="side-icon left-icon" />
          {bottoms[bottomIndex]?.image && <img src={bottoms[bottomIndex].image} className="outfit-preview-image" />}
          <img src="/right.png" onClick={() => slide("bottom", 1)} className="side-icon right-icon" />
        </div>
        <div className="virtual-category-container">
          <img src="/left.png" onClick={() => slide("foot", -1)} className="side-icon left-icon" />
          {footwear[footIndex]?.image && <img src={footwear[footIndex].image} className="outfit-preview-image" />}
          <img src="/right.png" onClick={() => slide("foot", 1)} className="side-icon right-icon" />
        </div>
      </div>

      <div className="outfit-button-wrapper">
        <button className="auto-btn" onClick={handleAutoGenerate}>AUTO-GENERATE</button>
        <div className="action-btn-row">
          <button className="action-btn" onClick={handleSeeLook}>See How It Looks</button>
          <button className="action-btn" onClick={handleSaveOutfit}>Save This Outfit</button>
        </div>
      </div>
    </div>
  );
};

export default Outfit;