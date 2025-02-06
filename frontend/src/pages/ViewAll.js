import React, { useEffect, useState } from 'react';
import "../index.css";
// components
import ItemDetails from "../components/ItemDetails";

const ViewAll = () => {
    const [items, setItems] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch('/api/items');
            const json = await response.json();

            if (response.ok) {
                setItems(json);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="home">
            <div className="items">
                {items &&
                    items.map((item) => (
                        <div className="item-wrapper" key={item._id}>
                            <ItemDetails item={item} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ViewAll;
