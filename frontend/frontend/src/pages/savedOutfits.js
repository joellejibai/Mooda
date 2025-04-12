import React, { useEffect, useState } from "react";
import { useAuthPages } from "../hooks/useAuthPages";

const SavedOutfits = () => {
  const { user } = useAuthPages();
  const [savedOutfits, setSavedOutfits] = useState([]);

  // Fetch all saved outfits
  const fetchSavedOutfits = async () => {
    try {
      const res = await fetch("/api/saved-outfits", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setSavedOutfits(data);
      else throw new Error(data.error);
    } catch (err) {
      console.error("Error fetching saved outfits:", err);
    }
  };

  // Rate outfit
  const handleRate = async (id, rating) => {
    try {
      const res = await fetch(`/api/saved-outfits/${id}/rating`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ rating }),
      });
      const updated = await res.json();
      if (res.ok) {
        setSavedOutfits((prev) =>
          prev.map((item) => (item._id === id ? updated : item))
        );
      }
    } catch (err) {
      console.error("Failed to rate outfit:", err);
    }
  };

  // Delete outfit
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this outfit?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/saved-outfits/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        setSavedOutfits((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete outfit:", err);
    }
  };

  useEffect(() => {
    if (user) fetchSavedOutfits();
  }, [user]);

  return (
    <div className="saved-outfits-container">
      <h2>My Saved Outfits</h2>

      {savedOutfits.length === 0 ? (
        <p>No outfits saved yet.</p>
      ) : (
        <div className="outfits-grid">
          {savedOutfits.map((outfit) => (
            <div className="outfit-card" key={outfit._id}>
              <div className="outfit-images">
                <img src={outfit.top?.image} alt="Top" />
                <img src={outfit.bottom?.image} alt="Bottom" />
                <img src={outfit.foot?.image} alt="Foot" />
              </div>

              <div className="outfit-actions">
                {/* <button
                  onClick={() => handleRate(outfit._id, "up")}
                  style={{ color: outfit.rating === "up" ? "green" : "black" }}
                >
                  👍
                </button>
                <button
                  onClick={() => handleRate(outfit._id, "down")}
                  style={{ color: outfit.rating === "down" ? "red" : "black" }}
                >
                  👎
                </button> */}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(outfit._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedOutfits;
