import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const Plan = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState(null);

  const handleVirtualFitClick = () => {
    navigate('/virtualfit');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <button className="virtual-go-back-button" onClick={handleGoBack}>
        <img src="/back.png" alt="Go Back" className="go-back-icon" />
      </button>

      <div className="smallGlass">
        <h2>Event Outfit Planning</h2>
      </div>

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

          <button className="virtualfit-button" onClick={handleVirtualFitClick}>
            <span className="virtual-plus-icon">+</span> Schedule an outfit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Plan;
