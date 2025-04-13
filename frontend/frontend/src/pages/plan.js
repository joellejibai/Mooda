import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useAuthPages } from '../hooks/useAuthPages'; // Assuming you have a custom hook to handle authentication

const Plan = ({ outfitId }) => {
  const navigate = useNavigate();
  const { user } = useAuthPages(); // Make sure the user is fetched correctly
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [savedDate, setSavedDate] = React.useState(null); // State to store the saved date

  const handleVirtualFitClick = () => {
    navigate('/virtualfit');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSaveDate = async () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    if (!user || !user.token) {
      alert('You must be logged in to save your outfit.');
      return;
    }

    try {
      const formattedDate = selectedDate.toISOString(); // Ensure the date is formatted correctly
      console.log('Formatted date:', formattedDate); // Log to check if date is valid

      const res = await fetch('/api/saved-outfits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Ensure token is available
        },
        body: JSON.stringify({ outfitId, date: formattedDate }), // Send outfitId and date
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('Error saving the date:', data); // Log the error response
        alert('Error saving the date.');
        return;
      }

      const data = await res.json();
      console.log('Outfit saved with date:', data);
      setSavedDate(formattedDate); // Update the state to display the saved date
      alert('Date saved successfully!');
      navigate('/dashboard'); // Or wherever you want to navigate after saving
    } catch (err) {
      console.error('Failed to save outfit:', err);
      alert('Failed to save the outfit. Please try again.');
    }
  };

  return (
    <div>
      <button className="virtual-go-back-button" onClick={handleGoBack}>
        <img src="/back.png" alt="Go Back" className="go-back-icon" />
      </button>

      <div className="smallGlass2">
        <h2>Event Outfit Planning</h2>
      </div>

      {/* Display the saved date at the top if available */}
      {savedDate && (
        <div className="saved-date" style={{ textAlign: 'center', margin: '20px 0' }}>
          <h3>Saved Date: {new Date(savedDate).toLocaleDateString()}</h3>
        </div>
      )}

      <div className="virtual-container">
        {/* MUI Calendar */}
        <div className="calendar-section" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div className="calendar-wrapper">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
              />
            </LocalizationProvider>
          </div>

          <button1 className="virtualfit-button" onClick={handleSaveDate}>
            Save the date
          </button1>
        </div>
      </div>
    </div>
  );
};

export default Plan;
