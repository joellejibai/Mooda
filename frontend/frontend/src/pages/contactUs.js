import React, { useState } from 'react';
import './contactUs';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [messages, setMessages] = useState([]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            setError("All fields are required");
            return;
        }

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullname: formData.name,
                    email: formData.email,
                    message: formData.message,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess("Message sent successfully!");
                setFormData({ name: "", email: "", message: "" }); // Reset form
                fetchMessages(); // Fetch updated messages
            } else {
                setError(data.msg.join(", ")); // Show errors from backend
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setError("An error occurred. Please try again.");
        }
    };

    // Fetch all messages from MongoDB (can be called after submitting the form)
    const fetchMessages = async () => {
        try {
            const response = await fetch("/api/contact/messages");
            const data = await response.json();
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    return (
        <div className="glass">
            {/* Contact Form Section */}
            <div className="contact-us-container">
                <h2>Contact Us</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
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

                {/* Display messages */}
                <div>
                    <h3>Submitted Messages</h3>
                    {messages.length > 0 ? (
                        <ul>
                            {messages.map((msg, index) => (
                                <li key={index}>
                                    <strong>{msg.fullname}:</strong> {msg.message}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No messages yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
