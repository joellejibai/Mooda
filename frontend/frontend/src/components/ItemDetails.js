import React from "react";
import "./ItemDetails"; // Make sure this file exists

const ItemDetails = ({ item }) => {
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

            <div className="item-info">
                <p><strong>Category:</strong> {item.category || "No Category"}</p>
                <p><strong>Color:</strong> {item.color || "No Color"}</p>
            </div>
        </div>
    );
};

export default ItemDetails;
