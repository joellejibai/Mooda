import React, { useState } from 'react';
import { useAuthPages } from "../hooks/useAuthPages";
import { AuthPages } from "../context/AuthPages";

const ItemsForm = () => {
    // Ensure you destructure user if it's provided by your hook/context
    const { user, dispatch } = useAuthPages();
    
    const [category, setCategory] = useState('');
    const [color, setColor] = useState('');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [material, setMaterial] = useState('');
    const [fit, setFit] = useState('');
    
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in');
            return;
        }

        const item = { category, color, brand, size, material, fit };
        const response = await fetch('/api/items', {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();
        if (!response.ok) {
            setError(json.error);
        } else {
            setCategory('');
            setColor('');
            setBrand('');
            setSize('');
            setMaterial('');
            setFit('');
            setError(null);
            console.log('new item added', json);
            // You might also want to dispatch an action here if necessary
        }
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add an item</h3>

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

            <label>BRAND</label>
            <input
                type="text"
                onChange={(e) => setBrand(e.target.value)}
                value={brand}
            />

            <label>SIZE</label>
            <input
                type="text"
                onChange={(e) => setSize(e.target.value)}
                value={size}
            />

            <label>MATERIAL</label>
            <input
                type="text"
                onChange={(e) => setMaterial(e.target.value)}
                value={material}
            />

            <label>FIT</label>
            <input
                type="text"
                onChange={(e) => setFit(e.target.value)}
                value={fit}
            />

            <button>Add Item</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default ItemsForm;
