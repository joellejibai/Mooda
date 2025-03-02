import React, { useRef, useState, useEffect } from "react";
import { GiClothes, GiMonclerJacket, GiLargeDress, GiChelseaBoot } from "react-icons/gi";
import { FaTshirt, FaRedhat } from "react-icons/fa";
import { PiPantsFill } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";

import ItemDetails from "../components/ItemDetails";

const Home = () => {
    const [items, setItems] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const ITEMS_PER_ROW = 4; // Number of items per row
    const ROWS_TO_SHOW = 2; // Show 2 rows initially
    const [searchTerm, setSearchTerm] = useState(""); // Use searchTerm instead of search
    const [selectedCategory, setSelectedCategory] = useState("all");

    const photoRef = useRef(null);
    const videoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const maxVisibleItems = ITEMS_PER_ROW * ROWS_TO_SHOW;

    const categoryMap = {
        all: [], // No filter for all items
        tops: ["tshirt", "sweater", "hoodie", "top"],
        pants: ["pants", "jeans", "shorts"],
        jackets: ["jacket", "coat", "blazer"],
        dresses: ["dress", "gown"],
        shoes: ["boots", "sneakers", "heels"],
        hats: ["hat", "cap", "beanie"],
    };


    const backgroundStyle = {
        backgroundImage: `url('/home.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        zIndex: -1,
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

    const startCamera = () => {
        if (isCameraActive) return;

        const canvas = photoRef.current;
        const ctx = canvas.getContext('2d');
        const width = 414;
        const height = width / (16 / 9);
        canvas.width = width;
        canvas.height = height;

        // Access the webcam and set up the video feed
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                // Set the video source to the stream only if it's not already set
                if (!videoRef.current.srcObject) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
                setIsCameraActive(true); // Make camera feed visible immediately
            })
            .catch((err) => {
                console.log("Error accessing camera: ", err);
            });
    };

    const takePhoto = () => {
        const canvas = photoRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;

        const width = 414;
        const height = width / (16 / 9);
        canvas.width = width;
        canvas.height = height;

        // Capture the current frame from the video
        ctx.drawImage(video, 0, 0, width, height);
        setHasPhoto(true);

        // Stop the video stream after taking the photo
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        setIsCameraActive(false); // Stop the camera after taking the photo
    };

    const closePhoto = () => {
        setHasPhoto(false);
        const canvas = photoRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    };

    useEffect(() => {
        console.log('Fetching items for category: ', selectedCategory);

        const fetchItems = async () => {
            const response = await fetch(`/api/items?search=${searchTerm}`);
            const json = await response.json();

            if (response.ok) {
                let filteredItems = json;

                // If a category other than "all" is selected, filter items by category
                if (selectedCategory !== "all") {
                    filteredItems = json.filter(item =>
                        categoryMap[selectedCategory].includes(item.category)
                    );
                }

                setItems(filteredItems);
            }
        };

        fetchItems();
    }, [searchTerm, selectedCategory]);  // Ensure the effect is triggered on category or search change


    return (
        <>
            <div style={backgroundStyle}></div>
            <div className="smallGlass">
                <div className="centered-container">
                    <h2>Your Wardrobe</h2>
                </div>
            </div>
            <div className="glass">
                <div className="circle-container">
                    {icons.map((icon, index) => (
                        <span
                            key={index}
                            className="clothing-circle"
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
                        value={searchTerm} // Bind to searchTerm
                        onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm
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
                        {/* Button with + Icon next to "Add Item" */}
                        <button onClick={startCamera}>
                            <CiCirclePlus size={30} style={{ marginRight: '8px' }} /> Add Item
                        </button>
                        {isCameraActive && (
                            <button onClick={takePhoto}>Take Photo</button>
                        )}
                    </div>
                    <div className={"result" + (hasPhoto ? " hasPhoto" : "")}>
                        <canvas ref={photoRef}></canvas>
                        <video ref={videoRef} style={{ display: isCameraActive ? 'block' : 'none', width: '100%' }}></video>
                        {hasPhoto && <button onClick={closePhoto}>Close</button>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
