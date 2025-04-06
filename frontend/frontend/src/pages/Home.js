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

        const imageUrl = canvas.toDataURL("image/png");
        setImageData(imageUrl);
    };

    const uploadImage = async () => {
        if (!imageData) return;

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ image: imageData }),
            });

            if (!response.ok) throw new Error("Upload failed");

            const result = await response.json();
            console.log("Image uploaded successfully:", result);

            setItems((prevItems) => [...prevItems, result]);

            setShowForm(false);
            setHasPhoto(false);
            setImageData(null);

            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            setIsCameraActive(false);

        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };


    const closePhoto = () => {
        setHasPhoto(false);
        const canvas = photoRef.current;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
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
                        <span
                        key={index}
                        className={`clothing-circle ${selectedCategory === icon.category ? "active" : ""}`}
                        onClick={() => setSelectedCategory(icon.category)}
                      >
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
                                {/* Display image if exists */}
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt="Item"
                                        style={{ width: "100px", marginTop: "10px", borderRadius: "8px" }}
                                    />
                                )}
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

                    {/* Conditionally render the ItemsForm */}
                    {showForm && <ItemsForm addItem={addItem} />}
                </div>

                <button onClick={() => { setShowForm(!showForm); startCamera(); }} className="toggle-form-button">
                    {showForm ? "Cancel" : "Add New Item"}
                </button>
                {showForm && (
                    <div className="camera-section">
                        <video ref={videoRef} autoPlay playsInline style={{ display: isCameraActive ? 'block' : 'none' }}></video>
                        {hasPhoto && <canvas ref={photoRef}></canvas>}
                        <button onClick={takePhoto}>Take Photo</button>
                        {hasPhoto && <button onClick={uploadImage}>Upload Image</button>}
                    </div>
                )}

            </div>
        </>
    );
};

export default Home;
