import React, { useRef, useState, useEffect } from "react";
import { GiClothes, GiMonclerJacket, GiLargeDress, GiChelseaBoot } from "react-icons/gi";
import { FaTshirt, FaRedhat } from "react-icons/fa";
import { PiPantsFill } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";
import { useAuthPages } from "../hooks/useAuthPages";
import ItemDetails from "../components/ItemDetails";
import ItemsForm from "../components/ItemsForm";  // Import the ItemsForm component
import axios from "axios";

const Home = () => {
    const { user } = useAuthPages();
    const [reason, setReason] = useState(null);
    const [items, setItems] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showForm, setShowForm] = useState(false);  // State to control form visibility
    const [uploadedFile, setUploadedFile] = useState(null);
    const [showAdvice, setShowAdvice] = useState(true);

    const [hasPhoto, setHasPhoto] = useState(false);
    const [imageData, setImageData] = useState("");
    const photoRef = useRef(null);
    const videoRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const ITEMS_PER_ROW = 4;
    const ROWS_TO_SHOW = 2;
    const maxVisibleItems = ITEMS_PER_ROW * ROWS_TO_SHOW;

    const categoryMap = {
        all: [],
        tops: ["tshirt", "sweater", "hoodie", "top", "crop-top", "tank-top"],
        pants: ["pants", "jeans", "shorts", "skirt", "sweatpants", "trousers", "skort", "leggings"],
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
                        Authorization: `Bearer ${user.token}`,

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

    // ✅ Replace your existing takePhoto with this:
    const takePhoto = async () => {
        const canvas = photoRef.current;
        const video = videoRef.current;

        if (!canvas || !video) {
            console.error("❌ Canvas or video element not found.");
            return;
        }

        const ctx = canvas.getContext("2d");
        const width = 414;
        const height = width / (16 / 9);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(video, 0, 0, width, height);

        const imageBase64 = canvas.toDataURL("image/png").split(",")[1]; // Remove data:image/png;base64,
        setHasPhoto(true);

        try {
            const response = await axios.post(
                "https://api.remove.bg/v1.0/removebg",
                {
                    image_file_b64: imageBase64,
                    size: "auto",
                },
                {
                    headers: {
                        "X-Api-Key": "g1kwjNwhTodt5aiYwDzzToJb",  // Replace with your API key
                        "Content-Type": "application/json",
                    },
                    responseType: "arraybuffer",
                }
            );

            const removedBgImage = `data:image/png;base64,${btoa(
                new Uint8Array(response.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                )
            )}`;

            setImageData(removedBgImage); // ✅ Store cleaned image here
        } catch (err) {
            console.error("❌ Error removing background:", err.response?.data || err.message);
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Full = reader.result; // full data:image/png;base64,...
            setHasPhoto(true);
            setImageData(base64Full); // 🔥 Pass full string for immediate preview

            setShowForm(true); // ✅ Open form AFTER setting the image

            // Optional: Remove.bg enhancement
            try {
                const response = await axios.post(
                    "https://api.remove.bg/v1.0/removebg",
                    {
                        image_file_b64: base64Full.split(",")[1], // this is the base64 without prefix
                        size: "auto"
                    },
                    {
                        headers: {
                            "X-Api-Key": "g1kwjNwhTodt5aiYwDzzToJb",
                            "Content-Type": "application/json"
                        },
                        responseType: "arraybuffer"
                    }
                );

                const result = `data:image/png;base64,${btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ""
                    )
                )}`;

                setImageData(result); // update with clean image
            } catch (err) {
                console.error("❌ Remove.bg error:", err.response?.data || err.message);
                // keep fallback image (already in imageData)
            }
        };

        reader.readAsDataURL(file);
    };


    const handleDeleteItem = async (id) => {
        try {
            const res = await fetch(`/api/items/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete item");

            setItems((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.error("Error deleting item:", err);
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
    const topCount = items.filter((item) => categoryMap["tops"].includes(item.category)).length;
    const bottomCount = items.filter((item) => categoryMap["pants"].includes(item.category)).length;
    const shoeCount = items.filter((item) => categoryMap["shoes"].includes(item.category)).length;
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
                {/* 🆕 Suggestions */}
                {showAdvice && (topCount === 1 || bottomCount === 1 || shoeCount === 1) && (
                    <div className="outfit-notif">
                        <h4>Some Advice for you! ✨</h4>
                        {topCount === 1 && <p>👕 You only have 1 top. Add more to create varied outfits!</p>}
                        {bottomCount === 1 && <p>👖 You only have 1 bottom. Consider adding more pants or skirts!</p>}
                        {shoeCount === 1 && <p>👟 Just 1 pair of shoes? A second option could spice things up!</p>}
                        <button onClick={() => setShowAdvice(false)}>✖</button>
                    </div>
                )}


                <div className="home">
                    <div className="items">
                        {(showAll ? items : items.slice(0, maxVisibleItems)).map((item) => (
                            <div className="item-wrapper" key={item._id}>
                                <ItemDetails
                                    item={item}
                                    onDelete={(deletedId) =>
                                        setItems((prevItems) => prevItems.filter((i) => i._id !== deletedId))
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    {items.length > maxVisibleItems && (
                        <button className="view-more-btn" onClick={() => setShowAll(!showAll)}>
                            {showAll ? "View Less" : "View More"}
                        </button>
                    )}

                    <div className={`result ${hasPhoto ? "hasPhoto" : ""}`}>

                        <canvas ref={photoRef}></canvas>
                        <video ref={videoRef} style={{ display: isCameraActive ? 'block' : 'none', width: '100%' }}></video>
                        {hasPhoto && <button onClick={closePhoto}>Close</button>}
                    </div>

                    {/* Conditionally render the ItemsForm */}
                    {showForm && (
                        <ItemsForm
                            addItem={addItem}
                            imageData={imageData}
                            onClose={() => {
                                setShowForm(false);
                                setImageData("");
                                setHasPhoto(false);
                                stopCamera(); // optional: stop camera after adding item
                            }}
                        />
                    )}
                </div>

                <button onClick={() => { setShowForm(!showForm); startCamera(); }} className="toggle-form-button">
                    {showForm ? "Cancel" : "Add New Item"}
                </button>
                {showForm && (
                    <>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUpload(e)}
                            style={{ marginTop: "1rem" }}
                        />
                        <div className="camera-section">
                            <video ref={videoRef} autoPlay playsInline style={{ display: isCameraActive ? 'block' : 'none' }}></video>
                            {hasPhoto && <canvas ref={photoRef}></canvas>}
                            <button onClick={takePhoto}>Take Photo</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Home;