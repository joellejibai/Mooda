import React, { useState } from "react";
import { useAuthPages } from "../hooks/useAuthPages";
import { AuthPages } from "../context/AuthPages";

const ItemsForm = ({ addItem, imageData }) => {
    const { user, dispatch } = useAuthPages();

    const [category, setCategory] = useState('');
    const [color, setColor] = useState('');
    const [imageURL, setImageURL] = useState('');

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in");
            return;
        }

        if (!imageData || imageData.trim() === "") {

            setError("Please take or upload a photo before submitting.");
            return;
        }

        const item = {
            image: imageData,
            category,
            color,
        };

        const response = await fetch("/api/upload", {  // ✅ <- use /upload
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`, // ✅ token will be used to get user_id in backend
            },
            body: JSON.stringify(item),
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.message || json.error || "Something went wrong");
            setSuccessMessage("");
        } else {
            addItem(json);
            setCategory("");
            setColor("");
            setError(null);
            setSuccessMessage("Item was added successfully!");
        }
    };



    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add an Item</h3>

            {/* Form Fields */}
            <label>CATEGORY</label>
            <input type="text" onChange={(e) => setCategory(e.target.value)} value={category} />

            <label>COLOR</label>
            <input type="text" onChange={(e) => setColor(e.target.value)} value={color} />

            {imageData && (
                <div className="image-preview-container">
                    <h4>Camera Photo Preview:</h4>
                    <div className="image-preview">
                        <img
                            src={imageData}
                            alt="Camera Preview"
                            style={{ maxWidth: "200px", height: "auto", borderRadius: "8px" }}
                        />
                    </div>
                </div>
            )}


            <button type="submit">Add Item</button>

            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
        </form>
    );
};

export default ItemsForm;
