import React, { useEffect, useState } from "react";
import { useAuthPages } from "../hooks/useAuthPages";
import { Link } from "react-router-dom";  // Import Link from React Router
import './savedOutfits';

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
      <h2> My Profile</h2>

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
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(outfit._id)}
                >
                  🗑 Delete
                </button>

                {/* Link to the Plan page with the outfit's details */}
                <Link
                  to={{
                    pathname: '/plan',
                    state: { outfit: outfit } // Passing the whole outfit object to the Plan page
                  }}
                  className="wear-again-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none",
                    marginLeft: "8px"
                  }}
                >
                  👕 Schedule the outfit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedOutfits;
