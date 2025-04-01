import React, { useState } from 'react';
import './contactUs';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            setError('All fields are required');
            return;
        }

        // Submit form (you can add API call here)
        console.log('Form submitted:', formData);

        // Reset the form
        setFormData({ name: '', email: '', message: '' });
        setError('');
    };

    return (
        <div className="glass">
            {/* Contact Form Section */}
            <div className="contact-us-container">
                <h2 style={"color:white"}>Contact Us</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                    />
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email"
                    />
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message"
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>


        </div>
    );
};

export default ContactUs;