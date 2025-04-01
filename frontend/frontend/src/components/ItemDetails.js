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
                    backgroundImage: `url(${item.imageURL})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></div>

            {/* Item Info on Hover */}
            <div className="item-info">
                <h3>{item.name || "No Name"}</h3>
                <p><strong>Brand:</strong> {item.brand || "No Brand"}</p>
                <p><strong>Category:</strong> {item.category || "No Category"}</p>
                <p><strong>Color:</strong> {item.color || "No Color"}</p>
                <p><strong>Size:</strong> {item.size || "No Size"}</p>
                <p><strong>Material:</strong> {item.material || "No Material"}</p>
                <p><strong>Fit:</strong> {item.fit || "No Fit"}</p>
                <p><strong>Description:</strong> {item.description || "No Description"}</p>
            </div>
        </div>
    );
};

export default ItemDetails;
