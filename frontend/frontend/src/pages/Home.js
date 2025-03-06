import React, { useRef, useState, useEffect } from "react";
import { GiClothes, GiMonclerJacket, GiLargeDress, GiChelseaBoot } from "react-icons/gi";
import { FaTshirt, FaRedhat } from "react-icons/fa";
import { PiPantsFill } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";
import { useAuthPages } from "../hooks/useAuthPages";
import ItemDetails from "../components/ItemDetails";
import ItemsForm from "../components/ItemsForm";  // Import the ItemsForm component

const Home = () => {
    const { user } = useAuthPages();
    const [items, setItems] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showForm, setShowForm] = useState(false);  // State to control form visibility

    const photoRef = useRef(null);
    const videoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);
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
        shoes: ["boots", "sneakers", "heels","shoes"],
        hats: ["hat", "cap", "beanie"],
    };

    const icons = [
        { icon: <GiClothes size={50} />, category: "all" },
        { icon: <FaTshirt size={50} />, category: "tops" },
        { icon: <PiPantsFill size={50} />, category: "pants" },
        { icon: <GiMonclerJacket size={50} />, category: "jackets" },
        { icon: <GiLargeDress size={50} />, category: "dresses" },
        { icon: <GiChelseaBoot size={50} />, category: "shoes" },
        { icon: <FaRedhat size={50} />, category: "hats" },
    ];

    // Fetch Items based on search and category
    useEffect(() => {
        if (!user) return;

        const fetchItems = async () => {
            try {
                const response = await fetch(`/api/items?search=${searchTerm}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                if (!response.ok) throw new Error("Failed to fetch items");

                const json = await response.json();
                let filteredItems = json;

                if (selectedCategory !== "all") {
                    filteredItems = json.filter(item =>
                        categoryMap[selectedCategory].includes(item.category)
                    );
                }

                setItems(filteredItems);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [searchTerm, selectedCategory, user]); // Dependencies

    // Camera Functions
    const startCamera = () => {
        if (isCameraActive) return;

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (!videoRef.current.srcObject) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
                setIsCameraActive(true);
            })
            .catch((err) => console.error("Error accessing camera:", err));
    };

    const takePhoto = () => {
        const canvas = photoRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;

        const width = 414;
        const height = width / (16 / 9);
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(video, 0, 0, width, height);
        setHasPhoto(true);

        const stream = video.srcObject;
        stream.getTracks().forEach(track => track.stop());

        setIsCameraActive(false);
    };

    const closePhoto = () => {
        setHasPhoto(false);
        const canvas = photoRef.current;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };

    // Callback function to update the items list when a new item is added
    const addItem = (newItem) => {
        setItems((prevItems) => [...prevItems, newItem]);
    };

    return (
        <>
            <div className="backgroundStyle"></div>
            <div className="smallGlass">
                <h2>Your Wardrobe</h2>
            </div>
            <div className="glass">
                <div className="circle-container">
                    {icons.map((icon, index) => (
                        <span key={index} className="clothing-circle" onClick={() => setSelectedCategory(icon.category)}>
                            {icon.icon}
                        </span>
                    ))}
                </div>

                <div className="category-display">
                    Selected Category: {selectedCategory}
                </div>

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
                            <CiCirclePlus size={30} style={{ marginRight: '8px' }} /> Add Item
                        </button>
                        {isCameraActive && (
                            <button onClick={takePhoto}>Take Photo</button>
                        )}
                    </div>

                    <div className={`result ${hasPhoto ? "hasPhoto" : ""}`}>
                        <canvas ref={photoRef}></canvas>
                        <video ref={videoRef} style={{ display: isCameraActive ? 'block' : 'none', width: '100%' }}></video>
                        {hasPhoto && <button onClick={closePhoto}>Close</button>}
                    </div>

                    {/* Button to show the form */}
                    <button
  onClick={() => setShowForm(!showForm)}
  className={`toggle-form-button ${showForm ? 'cancel' : ''}`}
>
  {showForm ? "Cancel" : "Add New Item"}
</button>


                    {/* Conditionally render the ItemsForm */}
                    {showForm && <ItemsForm addItem={addItem} />}
                </div>
            </div>
        </>
    );
};

export default Home;
