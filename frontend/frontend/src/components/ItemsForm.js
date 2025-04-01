import React, { useState } from "react";
import { useAuthPages } from "../hooks/useAuthPages";
import { AuthPages } from "../context/AuthPages";

const ItemsForm = ({ addItem }) => {
    const { user, dispatch } = useAuthPages();

    const [category, setCategory] = useState('');
    const [color, setColor] = useState('');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [material, setMaterial] = useState('');
    const [fit, setFit] = useState('');
    const [imageURL, setImageURL] = useState('');
    
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in");
            return;
        }

        const item = { category, color, brand, size, material, fit, imageURL };
        const response = await fetch("/api/items", {
            method: "POST",
            body: JSON.stringify(item),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        });

        const json = await response.json();
        if (!response.ok) {
            setError(json.error);
            setSuccessMessage("");
        } else {
            addItem(json);
            setCategory("");
            setColor("");
            setBrand("");
            setSize("");
            setMaterial("");
            setFit("");
            setImageURL("");
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

            <label>BRAND</label>
            <input type="text" onChange={(e) => setBrand(e.target.value)} value={brand} />

            <label>SIZE</label>
            <input type="text" onChange={(e) => setSize(e.target.value)} value={size} />

            <label>MATERIAL</label>
            <input type="text" onChange={(e) => setMaterial(e.target.value)} value={material} />

            <label>FIT</label>
            <input type="text" onChange={(e) => setFit(e.target.value)} value={fit} />

            <label>Image URL</label>
            <input 
                type="url"
                onChange={(e) => setImageURL(e.target.value)}
                value={imageURL}
                placeholder="Enter image URL"
            />

            {/* Image Preview */}
            {imageURL && (
                <div className="image-preview-container">
                    <h4>Preview:</h4>
                    <div className="image-preview">
                        <img 
                            src={imageURL} 
                            alt="Item Preview" 
                            onError={(e) => e.target.style.display = 'none'} // Hide if image fails to load
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
