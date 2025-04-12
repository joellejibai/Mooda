import React, { useState } from 'react';
import './moretips';

const MoreTips = () => {
  const [formData, setFormData] = useState({
    style: '',
    colorPalette: '',
    pattern: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      setError('You must be logged in to submit.');
      return;
    }

    const response = await fetch('/api/survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(formData),
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error || 'Submission failed.');
    } else {
      setSuccess('Survey submitted successfully!');
    }
  };

  return (
    <div className="more-tips-container">
      <h2>"Fashions fade, style is eternal." – Yves Saint Laurent</h2>
      <form onSubmit={handleSubmit} className="survey-form">
        <h3>Let us know your style</h3>

        <div className="form-section">
          <label>How would you best describe your style?</label>
          {['Casual', 'Chic', 'Sporty', 'Bohemian'].map((s) => (
            <div key={s}>
              <input type="radio" name="style" value={s} onChange={handleChange} /> {s}
            </div>
          ))}
        </div>

        <div className="form-section">
          <label>What is your favorite clothing color palette?</label>
          {[
            'Neutral (Black, White, Beige)',
            'Bright and Bold (Red, Yellow, Orange)',
            'Pastel (Soft Pink, Mint green, Lavender)',
            'Dark Tones (Navy, Dark Green, Maroon)',
          ].map((cp) => (
            <div key={cp}>
              <input type="radio" name="colorPalette" value={cp} onChange={handleChange} /> {cp}
            </div>
          ))}
        </div>

        <div className="form-section">
          <label>Which patterns do you prefer wearing?</label>
          {['Solid Colors', 'Stripes', 'Florals', 'Plaid'].map((p) => (
            <div key={p}>
              <input type="radio" name="pattern" value={p} onChange={handleChange} /> {p}
            </div>
          ))}
        </div>
<div className='button1'>
        <button type="submit">Submit</button></div>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </form>
    </div>
  );
};

export default MoreTips;
