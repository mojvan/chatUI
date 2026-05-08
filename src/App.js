import React, { useState, useRef, useEffect } from 'react';
import './ChatGPTStyle.css';

const App = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "سلام! من می‌توانم متن انگلیسی را خلاصه کرده و به فارسی ترجمه کنم. همچنین حافظه دارم و متن‌های قبلی را به یاد می‌سپارم. متن خود را ارسال کنید.",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationMemory, setConversationMemory] = useState([]); // حافظه مکالمه
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [inputValue]);

  // تابع خلاصه‌سازی و ترجمه متن
  const summarizeAndTranslate = async (userMessage, memory) => {
    const API_KEY = 'aa-EbnEbrAOIsPrPUHOps0yUNHRhXtZDuvEL6TX4sVfNOlwmKa0';
    
    // ساخت پرامپت با حافظه
    const systemPrompt = `شما یک دستیار هوشمند هستید که دو کار اصلی انجام می‌دهد:
1. متن انگلیسی کاربر را خلاصه می‌کنید (فقط نکات کلیدی در 2-3 جمله)
2. سپس خلاصه فارسی را به انگلیسی ترجمه می‌کنید

نکات مهم:
- اگر کاربر درخواست ترجمه پیام قبلی را دارد، از حافظه استفاده کنید
- حافظه مکالمه شامل تمام متن‌های ارسال شده قبلی است
- فرمت پاسخ شما باید دقیقاً به این شکل باشد:
📝 **خلاصه فارسی:** [متن خلاصه شده به فارسی]
🌐 **English Summary:** [همان خلاصه به انگلیسی]

اگر کاربر سوال دیگری پرسید یا درخواست خاصی داشت، ابتدا به آن پاسخ دهید سپس خلاصه‌سازی را انجام دهید.

حافظه مکالمه فعلی: ${memory.length > 0 ? memory.map(m => `- ${m}`).join('\n') : 'هیچ متن قبلی وجود ندارد'}`;

    try {
      const response = await fetch('https://api.avalapis.ir/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error ${response.status}:`, errorText);
        return `❌ خطای سرور: ${response.status}. لطفاً بعداً تلاش کنید.`;
      }

      const data = await response.json();
      
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const botResponse = data.choices[0].message.content;
        
        // ذخیره متن کاربر در حافظه (فقط متن اصلی، نه پاسخ ربات)
        if (userMessage.length > 10 && !userMessage.includes('ترجمه پیام قبلی') && !userMessage.includes('previous message')) {
          setConversationMemory(prev => [...prev, userMessage]);
        }
        
        return botResponse;
      }
      
      return 'خطا در پردازش درخواست. لطفاً دوباره تلاش کنید.';
      
    } catch (error) {
      console.error('Network error:', error);
      return '❌ خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.';
    }
  };

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
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    // دریافت پاسخ با حافظه
    const botResponseText = await summarizeAndTranslate(currentInput, conversationMemory);
    
    const botMessage = {
      id: Date.now() + 1,
      text: botResponseText,
      sender: "bot",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  // تابع پاک کردن حافظه
  const clearMemory = () => {
    setConversationMemory([]);
    const memoryClearedMessage = {
      id: Date.now(),
      text: "🧹 حافظه مکالمه پاک شد. می‌توانید متن‌های جدید را ارسال کنید.",
      sender: "bot",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, memoryClearedMessage]);
  };

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
      {/* هدر */}
      <div className="chat-header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L2 9L16 16L30 9L16 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M2 16L16 23L30 16" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M2 23L16 30L30 23" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            <h1>خلاصه‌ساز و مترجم هوشمند</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={clearMemory} title="پاک کردن حافظه">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="icon-btn" title="اطلاعات">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* نمایش تعداد متن‌های ذخیره شده در حافظه */}
      <div className="memory-badge" style={{
        position: 'sticky',
        top: '70px',
        zIndex: 10,
        textAlign: 'center',
        margin: '10px auto',
        padding: '5px 15px',
        backgroundColor: '#2c2c2e',
        borderRadius: '20px',
        width: 'fit-content',
        fontSize: '12px',
        color: '#aaa'
      }}>
        📚 حافظه: {conversationMemory.length} متن ذخیره شده
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
                <div className="message-bubble" style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6
                }}>
                  {message.text}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
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
                <div className="message-time">در حال پردازش...</div>
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
            placeholder="متن انگلیسی خود را وارد کنید... (Enter برای ارسال، Shift+Enter برای خط جدید)"
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
        <div style={{ fontSize: '11px', textAlign: 'center', marginTop: '8px', color: '#666' }}>
          💡 نکته: می‌توانید بپرسید "پیام قبلی را ترجمه کن" و ربات از حافظه استفاده می‌کند
        </div>
      </div>
    </div>
  );
};

export default App;