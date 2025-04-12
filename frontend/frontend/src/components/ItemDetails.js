import React, { useState } from "react";
import { useAuthPages } from "../hooks/useAuthPages";

const ItemDetails = ({ item, onDelete }) => {
    const { user } = useAuthPages();
    const [showConfirm, setShowConfirm] = useState(false);

    const confirmDelete = async () => {
        try {
            const res = await fetch(`/api/items/${item._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete");

            if (onDelete) onDelete(item._id);
            setShowConfirm(false); // Close popup after delete
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    return (
        <div className="item-card">
            <div
                className="item-image"
                style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></div>

            {/* Delete icon OUTSIDE the blurred area */}
            <span className="delete-overlay" onClick={() => setShowConfirm(true)}>
                🗑
            </span>

            <div className="item-info">
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Color:</strong> {item.color}</p>
            </div>

            {/* Custom popup for confirmation */}
            {showConfirm && (
                <div className="confirm-popup">
                    <p>Are you sure you want to delete this item?</p>
                    <div className="popup-buttons">
                        <button onClick={confirmDelete}>Yes</button>
                        <button onClick={() => setShowConfirm(false)}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetails;
