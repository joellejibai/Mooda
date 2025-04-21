import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useAuthPages } from '../hooks/useAuthPages';
import { Box } from '@mui/material';

const Plan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { outfit } = location.state || {};
  const { user } = useAuthPages();

  const [selectedDate, setSelectedDate] = React.useState(null);
  const [savedDate, setSavedDate] = React.useState(null);
  const [existingPlannedDates, setExistingPlannedDates] = React.useState([]);

  const handleGoBack = () => {
    navigate(-1);
  };

  React.useEffect(() => {
    const fetchPlannedDate = async () => {
      if (!outfit || !user?.token) return;

      try {
        const res = await fetch(`/api/saved-outfits/${outfit._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch outfit details');
          return;
        }

        const data = await res.json();
        if (data.date) {
          setSavedDate(data.date);
        }
      } catch (err) {
        console.error('Error fetching saved outfit:', err);
      }
    };

    const fetchExistingPlannedDates = async () => {
      if (!user?.token) return;

      try {
        const res = await fetch('/api/saved-outfits', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch existing planned dates');
          return;
        }

        const data = await res.json();
        setExistingPlannedDates(data.filter(item => item.date));
        console.log('Fetched planned dates:', data.filter(item => item.date));
      } catch (err) {
        console.error('Error fetching existing planned dates:', err);
      }
    };

    fetchPlannedDate();
    fetchExistingPlannedDates();
  }, [outfit, user]);

  const handleSaveDate = async () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }

    if (!user?.token) {
      alert('You must be logged in to save your outfit.');
      return;
    }

    if (!outfit) {
      alert('No outfit selected.');
      return;
    }

    const formattedSelectedDate = selectedDate.toISOString().split('T')[0];

    const conflictingOutfit = existingPlannedDates.find(item => {
      const existingDate = new Date(item.date).toISOString().split('T')[0];
      return existingDate === formattedSelectedDate && item._id !== outfit._id;
    });

    if (conflictingOutfit) {
      alert('This date is already taken by another outfit.');
      return;
    }

    try {
      const res = await fetch(`/api/saved-outfits/${outfit._id}/plan`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('Error saving the date:', data);
        alert('Error saving the outfit with date.');
        return;
      }

      const data = await res.json();
      setSavedDate(data.date);
      setExistingPlannedDates(prev => {
        const existing = prev.filter(item => item._id !== outfit._id);
        return [...existing, data];
      });
      alert('Outfit date saved successfully!');
    } catch (err) {
      console.error('Failed to save outfit date:', err);
      alert('Failed to save the outfit date. Please try again.');
    }
  };

  const handleNavigateToSavedOutfits = () => {
    navigate('/savedOutfits');
  };

  const renderDay = (day, _selectedDate, pickersDayProps) => {
    const formattedDay = day.toISOString().split('T')[0];
    
    const isTaken = existingPlannedDates.some(item => {
      if (!item.date) return false;
      const existingDate = new Date(item.date).toISOString().split('T')[0];
      return existingDate === formattedDay && (!outfit || item._id !== outfit._id);
    });
    
    const isSavedDate = savedDate && new Date(savedDate).toISOString().split('T')[0] === formattedDay;

    return (
      <Box
        {...pickersDayProps}
        sx={{
          position: 'relative',
          '& .MuiPickersDay-dayWithMargin': {
            position: 'relative',
          },
          ...(isSavedDate && {
            '& .Mui-selected': {
              backgroundColor: 'rgba(0, 0, 255, 0.3)',
            }
          }),
        }}
      >
        {pickersDayProps.day}
        {(isTaken || isSavedDate) && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isSavedDate ? 'blue' : 'red',
              zIndex: 1,
            }}
          />
        )}
      </Box>
    );
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
                onChange={(newValue) => setSelectedDate(newValue)}
                renderDay={renderDay}
              />
            </LocalizationProvider>
          </div>

          <button className="virtualfit-button" onClick={handleSaveDate}>
            Save the date
          </button>
        </div>
      </div>

      <div className="saved-outfits-button" style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handleNavigateToSavedOutfits} className="virtualfit-button">
          Go to Saved Outfits
        </button>
      </div>
    </div>
  );
};

export default Plan;