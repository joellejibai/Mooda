import React, { useEffect, useState } from 'react';
import { useAuthPages } from '../hooks/useAuthPages';
import { Link } from 'react-router-dom';

const SavedOutfits = () => {
  const { user } = useAuthPages();
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

  // Fetch saved outfits
  const fetchSavedOutfits = async () => {
    try {
      const res = await fetch('/api/saved-outfits', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) setSavedOutfits(data);
      else throw new Error(data.error);
    } catch (err) {
      console.error('Error fetching saved outfits:', err);
    }
  };

  // Fetch profile picture
  const fetchProfilePic = async () => {
    try {
      const res = await fetch('/api/profile-pic', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok && data.image) {
        setProfilePic(data.image); // ✅ Full base64 string with prefix
      } else {
        setProfilePic(null);
      }
    } catch (err) {
      console.error('Error fetching profile picture:', err);
    }
  };

  // Delete saved outfit
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this outfit?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/saved-outfits/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        setSavedOutfits((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete outfit:', err);
    }
  };

  // Upload and save profile picture
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const fullBase64 = reader.result; // ✅ includes data:image/... prefix

      try {
        const res = await fetch('/api/profile-pic', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: fullBase64 }), // ✅ send full string
        });

        const data = await res.json();
        if (res.ok) {
          setProfilePic(fullBase64); // ✅ save full string with prefix
        } else {
          console.error('Error updating profile picture:', data);
        }
      } catch (err) {
        console.error('Error updating profile picture:', err);
      }
    };

    reader.readAsDataURL(file); // ✅ keep full data URL
  };

  useEffect(() => {
    if (user) {
      fetchSavedOutfits();
      fetchProfilePic();
    }
  }, [user]);

  return (
    <div className="saved-outfits-container">
      <div className="glass-box2">
        <div className="profile-info-horizontal">
          <div className="profile-pic-wrapper">
            <img
              src={profilePic || 'default-profile-pic.jpg'} // ✅ directly use the full string
              alt="Profile"
              className="profile-pic"
            />
            <button
              className="edit-pic-btn"
              onClick={() => document.getElementById('profile-pic-upload').click()}
            >
              <i className="fas fa-pen"></i> Edit
            </button>
            <input
              type="file"
              id="profile-pic-upload"
              onChange={handleProfilePicChange}
              accept="image/*"
              style={{ display: 'none' }}
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
                <img src={outfit.top?.image || 'default-top-image.jpg'} alt="Top" />
                <img src={outfit.bottom?.image || 'default-bottom-image.jpg'} alt="Bottom" />
                <img src={outfit.foot?.image || 'default-foot-image.jpg'} alt="Foot" />
              </div>

              <div className="outfit-details">
                {outfit.date && (
                  <div className="outfit-date">
                    <p>Planned for: {new Date(outfit.date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="outfit-actions">
                <button className="delete-btn" onClick={() => handleDelete(outfit._id)}>
                  🗑 Delete
                </button>

                {!outfit.date && (
                  <Link
                    to="/plan"
                    state={{ outfit }}
                    className="wear-again-btn"
                  >
                    👕 Schedule the outfit
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedOutfits;
