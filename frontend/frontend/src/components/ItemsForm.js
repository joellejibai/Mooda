import React, { useState, useEffect } from "react";
import { useAuthPages } from "../hooks/useAuthPages";
import { AuthPages } from "../context/AuthPages";

const ItemsForm = ({ addItem, imageData, onClose }) => {
    const { user } = useAuthPages();

    const [category, setCategory] = useState('');
    const [color, setColor] = useState('');
    const [imageURL, setImageURL] = useState(imageData || '');
    const [previewImage, setPreviewImage] = useState(imageData || '');

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // 👁️ Show preview right away
    useEffect(() => {
        if (imageData) {
            setPreviewImage(imageData); // Show original immediately
        }
    }, [imageData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in");
            return;
        }

        if (!previewImage || previewImage.trim() === "" || previewImage.length < 100) {
            setError("Please take or upload a photo before submitting.");
            return;
        }

        const item = {
            image: previewImage, // ✅ Submit cleaned image if available
            category,
            color,
        };

        const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
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
            if (onClose) onClose();
        }
    };

    // 🔍 Debug
    console.log("🖼️ Preview image being shown:", previewImage);

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add an Item</h3>

            <label>CATEGORY</label>
            <input
                type="text"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
            />

            <label>COLOR</label>
            <input
                type="text"
                onChange={(e) => setColor(e.target.value)}
                value={color}
            />

            {previewImage && previewImage.length > 100 && (
                <div className="image-preview-container">
                    <h4>Camera Photo Preview:</h4>
                    <div className="image-preview">
                        {imageData && (
                            <img
                                src={imageData}
                                alt="Preview"
                                className="preview-img"
                            />

                        )}

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
