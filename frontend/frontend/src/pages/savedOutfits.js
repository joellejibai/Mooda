import React, { useEffect, useState } from "react";
import { useAuthPages } from "../hooks/useAuthPages";
import { Link } from "react-router-dom";

const SavedOutfits = () => {
  const { user } = useAuthPages();
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

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

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePic(url);
      localStorage.setItem("profilePic", url);
    }
  };

  // Load the profile picture from localStorage when the component mounts
  useEffect(() => {
    const storedPic = localStorage.getItem("profilePic");
    if (storedPic) {
      setProfilePic(storedPic);
    }
  }, []);

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
      {/* <div className="smallGlass">
        <h2>My Profile</h2>
      </div> */}

      {/* Glass Box for Profile Info */}
      <div className="glass-box2">
        <div className="profile-info-horizontal">
          <div className="profile-pic-wrapper">
            <img
              src={profilePic || "default-profile-pic.jpg"}
              alt="Profile"
              className="profile-pic"
            />
            <button
              className="edit-pic-btn"
              onClick={() => document.getElementById("profile-pic-upload").click()}
            >
              <i className="fas fa-pen"></i> Edit
            </button>
            <input
              type="file"
              id="profile-pic-upload"
              onChange={handleProfilePicChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          {user && (
            <div className="user-email-side">
              <p>{user.email.split('@')[0]}</p>
            </div>
          )}
        </div>
      </div>

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

                <Link
                  to={{
                    pathname: '/plan',
                    state: { outfit: outfit },
                  }}
                  className="wear-again-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none",
                    marginLeft: "8px",
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
