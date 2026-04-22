import React, { useState, useRef, useEffect } from 'react';
import './ChatGPTStyle.css'; // فایل CSS جدید که می‌سازیم

const App = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "سلام! چطور می‌توانم به شما کمک کنم؟",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // اسکرول خودکار به آخرین پیام
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // تغییر خودکار ارتفاع textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [inputValue]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // اضافه کردن پیام کاربر
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // شبیه‌سازی پاسخ ربات (بعداً به API واقعی وصل کن)
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (message) => {
    // اینجا می‌تونی به API واقعی مثل OpenAI وصل کنی
    const responses = {
      "سلام": "سلام! چطور می‌توانم کمکتان کنم؟",
      "چطوری": "خوبم ممنون! شما چطورید؟",
      "خداحافظ": "خداحافظ! روز خوبی داشته باشید.",
    };
    
    for (const [key, value] of Object.entries(responses)) {
      if (message.includes(key)) return value;
    }
    return "سوال خوبی پرسیدید! در حال یادگیری هستم. سوال دیگه‌ای دارید؟";
  };

  /*
  const getBotResponse = async (message) => {
  try {
    const response = await fetch('YOUR_API_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    return data.reply;
  } catch (error) {
    return "متاسفانه خطایی رخ داده. لطفاً دوباره تلاش کنید.";
  }
};
*/

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      {/* هدر شبیه ChatGPT */}
      <div className="chat-header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L2 9L16 16L30 9L16 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M2 16L16 23L30 16" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M2 23L16 30L30 23" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            <h1>ChatGPT Clone</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn" title="موضوع جدید">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button className="icon-btn" title="تنظیمات">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M19.4 15.05L18.3 15.9C17.9 16.2 17.8 16.8 18 17.3L18.5 18.6C18.8 19.4 18.2 20.2 17.4 20.2H15.9C15.4 20.2 14.9 20.5 14.7 21L14.3 22.2C14.1 23 13.3 23.5 12.5 23.5H11.5C10.7 23.5 9.9 23 9.7 22.2L9.3 21C9.1 20.5 8.6 20.2 8.1 20.2H6.6C5.8 20.2 5.2 19.4 5.5 18.6L6 17.3C6.2 16.8 6.1 16.2 5.7 15.9L4.6 15.05C3.9 14.5 3.9 13.5 4.6 12.95L5.7 12.1C6.1 11.8 6.2 11.2 6 10.7L5.5 9.4C5.2 8.6 5.8 7.8 6.6 7.8H8.1C8.6 7.8 9.1 7.5 9.3 7L9.7 5.8C9.9 5 10.7 4.5 11.5 4.5H12.5C13.3 4.5 14.1 5 14.3 5.8L14.7 7C14.9 7.5 15.4 7.8 15.9 7.8H17.4C18.2 7.8 18.8 8.6 18.5 9.4L18 10.7C17.8 11.2 17.9 11.8 18.3 12.1L19.4 12.95C20.1 13.5 20.1 14.5 19.4 15.05Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* منطقه پیام‌ها */}
      <div className="messages-area">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-wrapper ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-avatar">
                {message.sender === 'bot' ? (
                  <div className="bot-avatar">🤖</div>
                ) : (
                  <div className="user-avatar">👤</div>
                )}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {message.text}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {/* تایپینگ ایندیکاتور */}
          {isTyping && (
            <div className="message-wrapper bot-message">
              <div className="message-avatar">
                <div className="bot-avatar">🤖</div>
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ناحیه ورودی */}
      <div className="input-area">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="پیام خود را بنویسید... (Enter برای ارسال، Shift+Enter برای خط جدید)"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="send-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;