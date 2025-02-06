import React, { useRef, useEffect, useState } from "react";
import { GiClothes, GiMonclerJacket, GiLargeDress, GiChelseaBoot } from "react-icons/gi";
import { FaTshirt, FaRedhat } from "react-icons/fa";
import { PiPantsFill } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci"; // Import the + icon

import ItemDetails from "../components/ItemDetails";

const Home = () => {
    const [items, setItems] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const ITEMS_PER_ROW = 4; // Number of items per row
    const ROWS_TO_SHOW = 2; // Show 2 rows initially
    const [searchTerm, setSearchTerm] = useState(""); // Use searchTerm instead of search

    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);

    const maxVisibleItems = ITEMS_PER_ROW * ROWS_TO_SHOW;

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
        <GiClothes size={50} />,
        <FaTshirt size={50} />,
        <PiPantsFill size={50} />,
        <GiMonclerJacket size={50} />,
        <GiLargeDress size={50} />,
        <GiChelseaBoot size={50} />,
        <FaRedhat size={50} />,
    ];

    const takePhoto = () => {
        const video = document.createElement('video');
        const canvas = photoRef.current;
        const ctx = canvas.getContext('2d');
        const width = 414;
        const height = width / (16 / 9);
        canvas.width = width;
        canvas.height = height;

        // Access the webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
                video.play();

                // Draw the video frame to the canvas
                video.onloadedmetadata = () => {
                    setTimeout(() => {
                        ctx.drawImage(video, 0, 0, width, height);
                        setHasPhoto(true);
                        // Stop the video stream once the photo is taken
                        stream.getTracks().forEach(track => track.stop());
                    }, 100); // Slight delay to ensure the video is ready
                };
            })
            .catch((err) => {
                console.log("Error accessing camera: ", err);
            });
    };

    const closePhoto = () => {
        setHasPhoto(false);
        const canvas = photoRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    };

    // Fetch items whenever searchTerm changes
    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch(`/api/items?search=${searchTerm}`); // Use searchTerm here
            const json = await response.json();

            if (response.ok) {
                setItems(json);
            }
        };

        fetchItems();
    }, [searchTerm]); // Watch for changes to searchTerm

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
                        <span key={index} className="clothing-circle">
                            {icon}
                        </span>
                    ))}
                </div>
                {/* Make the search input a separate flexbox container */}
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
                        <button onClick={takePhoto}>
                            <CiCirclePlus size={30} style={{ marginRight: '8px' }} /> Add Item
                        </button>
                    </div>
                    <div className={"result" + (hasPhoto ? " hasPhoto" : "")}>
                        <canvas ref={photoRef}></canvas>
                        {hasPhoto && <button onClick={closePhoto}>Close</button>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
