import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useAuthPages } from '../hooks/useAuthPages';

const Plan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { outfit } = location.state || {};
  const { user } = useAuthPages();

  const [selectedDate, setSelectedDate] = React.useState(null);
  const [savedDate, setSavedDate] = React.useState(null);

  // Handle going back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle saving the planned date for the outfit
  const handleSaveDate = async () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    if (!user || !user.token) {
      alert('You must be logged in to save your outfit.');
      return;
    }

    if (!outfit) {
      alert('No outfit selected.');
      return;
    }

    try {
      const formattedDate = selectedDate.toISOString();

      const res = await fetch(`/api/saved-outfits/${outfit._id}/plan`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          date: formattedDate, // Only send the date to update
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('Error saving the date:', data);
        alert('Error saving the outfit with date.');
        return;
      }

      const data = await res.json();
      setSavedDate(formattedDate);
      alert('Outfit date saved successfully!');
    } catch (err) {
      console.error('Failed to save outfit date:', err);
      alert('Failed to save the outfit date. Please try again.');
    }
  };

  // Navigate to the SavedOutfits page
  const handleNavigateToSavedOutfits = () => {
    navigate('/savedOutfits'); // Adjust this path if necessary
  };

  return (
    <div>
      <button className="virtual-go-back-button" onClick={handleGoBack}>
        <img src="/back.png" alt="Go Back" className="go-back-icon" />
      </button>

      <div className="smallGlass2">
        <h2>Event Outfit Planning</h2>
      </div>

      {outfit && (
        <div className="outfit-preview" style={{ textAlign: 'center', marginTop: '1rem' }}>
          <h3>You're planning to wear this:</h3>
          <div
            className="outfit-images"
            style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}
          >
            {outfit.top && <img src={outfit.top.image} alt="Top" style={{ height: 120 }} />}
            {outfit.bottom && <img src={outfit.bottom.image} alt="Bottom" style={{ height: 120 }} />}
            {outfit.foot && <img src={outfit.foot.image} alt="Footwear" style={{ height: 120 }} />}
          </div>
        </div>
      )}

      {/* Display selected date immediately */}
      {selectedDate && (
        <div className="selected-date" style={{ textAlign: 'center', margin: '20px 0' }}>
          <h3>Selected Date: {selectedDate.toLocaleDateString()}</h3>
        </div>
      )}

      {savedDate && (
        <div className="saved-date" style={{ textAlign: 'center', margin: '20px 0' }}>
          <h3>Saved Date: {new Date(savedDate).toLocaleDateString()}</h3>
        </div>
      )}

      <div className="virtual-container">
        <div className="calendar-section" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div className="calendar-wrapper">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)} // Update selected date as the user picks it
              />
            </LocalizationProvider>
          </div>

          <button className="virtualfit-button" onClick={handleSaveDate}>
            Save the date
          </button>
        </div>
      </div>

      {/* Button to go to SavedOutfits page */}
      <div className="saved-outfits-button" style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handleNavigateToSavedOutfits} className="virtualfit-button">
          Go to Saved Outfits
        </button>
      </div>
    </div>
  );
};

export default Plan;
