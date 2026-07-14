import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { generateAIResponse } from '../services/aiService';

export default function AIChat({ apiConfig, defaultPrompts = [], contextTitle = "Matchday Guide" }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'bot',
      text: "Hello! I am ArenaIQ, your GenAI stadium operations assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (!textToSend) {
      setInput('');
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = Math.random().toString();
    const botMsgId = Math.random().toString();

    // Append User Message
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', text: query, timestamp }
    ]);

    setIsTyping(true);

    // Append Empty Bot Message that we will stream into
    setMessages(prev => [
      ...prev,
      { id: botMsgId, role: 'bot', text: '', timestamp }
    ]);

    let fullResponse = '';
    
    try {
      await generateAIResponse(query, apiConfig, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => 
          prev.map(msg => msg.id === botMsgId ? { ...msg, text: fullResponse } : msg)
        );
      });
    } catch (err) {
      setMessages(prev => 
        prev.map(msg => msg.id === botMsgId ? { ...msg, text: "Sorry, I encountered an issue processing that query. Please try again." } : msg)
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handlePromptChipClick = (promptText) => {
    handleSend(promptText);
  };

  return (
    <div className="clay-card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      maxHeight: '600px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '2px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1b2234'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>ArenaIQ GenAI Assistant</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isTyping ? 'var(--warning)' : 'var(--primary)',
            boxShadow: `0 0 8px ${isTyping ? 'var(--warning)' : 'var(--primary)'}`
          }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {apiConfig?.service === 'mock' ? 'Simulated AI' : `${apiConfig?.service.toUpperCase()} Live`}
          </span>
        </div>
      </div>

      {/* Messages Window */}
      <div style={{
        flex: 1,
        padding: '1.25rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        backgroundColor: '#10141e',
        boxShadow: 'var(--clay-shadow-input)'
      }}
        aria-label={`Chat history for ${contextTitle}`}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`chat-bubble ${msg.role}`}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              whiteSpace: 'pre-wrap'
            }}
          >
            <div>{msg.text || (isTyping && msg.text === '' ? '...' : '')}</div>
            <div style={{ 
              fontSize: '0.65rem', 
              color: msg.role === 'user' ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)', 
              textAlign: 'right',
              marginTop: '0.25rem',
              fontWeight: 600
            }}>
              {msg.timestamp}
            </div>
          </div>
        ))}
        {isTyping && messages[messages.length - 1].text === '' && (
          <div className="chat-bubble bot" style={{ alignSelf: 'flex-start' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Thinking...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Recommended Prompts */}
      {defaultPrompts.length > 0 && (
        <div style={{
          padding: '0.5rem 1rem',
          borderTop: '2px solid var(--border-color)',
          backgroundColor: '#1b2234',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          maxHeight: '80px',
          overflowY: 'auto'
        }}>
          {defaultPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handlePromptChipClick(prompt)}
              className="btn btn-secondary"
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '12px',
                whiteSpace: 'nowrap',
                fontWeight: 700
              }}
              disabled={isTyping}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div style={{
        padding: '0.75rem 1rem',
        borderTop: '2px solid var(--border-color)',
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: '#1b2234'
      }}>
        <input
          type="text"
          className="input-control"
          placeholder="Ask ArenaIQ anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isTyping}
          aria-label="Ask ArenaIQ stadium assistant a question"
        />
        <button
          className="btn btn-primary"
          onClick={() => handleSend()}
          disabled={isTyping || !input.trim()}
          style={{ width: '42px', height: '42px', padding: 0, borderRadius: '14px' }}
          aria-label="Send message to AI"
          type="button"
        >
          {isTyping ? <RefreshCw className="glow-active" size={16} /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
