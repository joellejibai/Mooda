import React from "react";
import "./ItemDetails"; // Ensure you have a CSS file for styling

const ItemDetails = ({ item }) => {
    console.log("Item Data:", item); // Debugging to check if data exists

    return (
        <div className="item-card">
            {/* Image Background */}
            <div
                className="item-image"
                style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></div>

            {/* Item Info on Hover */}
            <div className="item-info">
                <p><strong>Category:</strong> {item.category || "No Category"}</p>
                <p><strong>Color:</strong> {item.color || "No Color"}</p>
                <p><strong>Description:</strong> {item.description || "No Description"}</p>
            </div>
        </div>
    );
};

export default ItemDetails;
