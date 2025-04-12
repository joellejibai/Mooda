import React, { useState } from "react";
import axios from "axios";
import ChatBot from './components/ChatBot';


const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(
        "https://hf.space/embed/microsoft/DialoGPT-small/+/api/predict",
        {
          data: [input],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const reply = {
        role: "assistant",
        content:
          response?.data?.data?.[0] || "Sorry, I couldn’t come up with a reply.",
      };

      setMessages([...newMessages, reply]);
    } catch (error) {
      console.error("HuggingFace error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Oops! I'm having trouble answering right now.",
        },
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <h4>Mooda AI</h4>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about outfits..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      ) : (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
};

export default ChatBot;
