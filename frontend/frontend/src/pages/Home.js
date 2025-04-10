import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import {
  GiClothes,
  GiMonclerJacket,
  GiLargeDress,
  GiChelseaBoot
} from "react-icons/gi";
import { FaTshirt, FaRedhat } from "react-icons/fa";
import { PiPantsFill } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";
import { useAuthPages } from "../hooks/useAuthPages";
import ItemDetails from "../components/ItemDetails";
import ItemsForm from "../components/ItemsForm";

const Home = () => {
  const { user } = useAuthPages();
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [imageData, setImageData] = useState(null);
  const photoRef = useRef(null);
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const ITEMS_PER_ROW = 4;
  const ROWS_TO_SHOW = 2;
  const maxVisibleItems = ITEMS_PER_ROW * ROWS_TO_SHOW;

  const categoryMap = {
    all: [],
    tops: ["tshirt", "sweater", "hoodie", "top"],
    pants: ["pants", "jeans", "shorts"],
    jackets: ["jacket", "coat", "blazer"],
    dresses: ["dress", "gown"],
    shoes: ["boots", "sneakers", "heels", "shoes"],
    hats: ["hat", "cap", "beanie"]
  };

  const icons = [
    { icon: <GiClothes size={50} />, category: "all" },
    { icon: <FaTshirt size={50} />, category: "tops" },
    { icon: <PiPantsFill size={50} />, category: "pants" },
    { icon: <GiMonclerJacket size={50} />, category: "jackets" },
    { icon: <GiLargeDress size={50} />, category: "dresses" },
    { icon: <GiChelseaBoot size={50} />, category: "shoes" },
    { icon: <FaRedhat size={50} />, category: "hats" }
  ];

  useEffect(() => {
    if (!user) return;

    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/items?search=${searchTerm}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch items");

        const json = await response.json();
        let filteredItems = json;

        if (selectedCategory !== "all") {
          filteredItems = json.filter((item) =>
            categoryMap[selectedCategory].includes(item.category)
          );
        }

        setItems(filteredItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [searchTerm, selectedCategory, user]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const takePhoto = async () => {
    const canvas = photoRef.current;
    const video = videoRef.current;

    const ctx = canvas.getContext("2d");
    const width = 414;
    const height = width / (16 / 9);
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/png");

    try {
      const blob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append("image_file", blob, "photo.png");

      const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
        headers: {
          "X-Api-Key": "YOUR_REMOVE_BG_API_KEY",
          "Content-Type": "multipart/form-data"
        },
        responseType: "blob"
      });

      const resultUrl = URL.createObjectURL(response.data);
      setImageData(resultUrl);
      setHasPhoto(true);
    } catch (error) {
      console.error("Background removal failed:", error);
    }
  };

  const closePhoto = () => {
    setHasPhoto(false);
    const canvas = photoRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const addItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <>
      <div className="backgroundStyle"></div>
      <div className="smallGlass"><h2>Your Wardrobe</h2></div>
      <div className="glass">
        <div className="circle-container">
          {icons.map((icon, index) => (
            <span
              key={index}
              className={`clothing-circle ${selectedCategory === icon.category ? "active" : ""}`}
              onClick={() => setSelectedCategory(icon.category)}
            >
              {icon.icon}
            </span>
          ))}
        </div>

        <div className="category-display">Selected Category: {selectedCategory}</div>

        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for items..."
            className="search-bar"
          />
        </div>

        <div className="home">
          <div className="items">
            {(showAll ? items : items.slice(0, maxVisibleItems)).map((item) => (
              <div className="item-wrapper" key={item._id}>
                <ItemDetails item={item} />
              </div>
            ))}
          </div>

          {items.length > maxVisibleItems && (
            <button className="view-more-btn" onClick={() => setShowAll(!showAll)}>
              {showAll ? "View Less" : "View More"}
            </button>
          )}

          <div className="camera">
            <button onClick={startCamera}>
              <CiCirclePlus size={30} style={{ marginRight: "8px" }} /> Add Item
            </button>
            {isCameraActive && (
              <button onClick={takePhoto}>Take Photo</button>
            )}
          </div>

          <div className={`result ${hasPhoto ? "hasPhoto" : ""}`}>
            {hasPhoto && <img src={imageData} alt="Processed" style={{ width: "100%" }} />}
            <video ref={videoRef} style={{ display: isCameraActive ? "block" : "none", width: "100%" }}></video>
            {hasPhoto && <button onClick={closePhoto}>Close</button>}
          </div>

          {showForm && <ItemsForm addItem={addItem} imageData={imageData} />}
        </div>

        <button onClick={() => { setShowForm(!showForm); startCamera(); }} className="toggle-form-button">
          {showForm ? "Cancel" : "Add New Item"}
        </button>
      </div>
    </>
  );
};

export default Home;
