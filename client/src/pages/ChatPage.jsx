import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Hash, MoreVertical, Search, ArrowLeft, Info, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ChatPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, currentUser, chats, sendMessage } = useApp();

  const [message, setMessage] = useState('');
  const [activeEventId, setActiveEventId] = useState(eventId ? Number(eventId) : null);
  const messagesEndRef = useRef(null);

  // Default to first chat if none selected
  useEffect(() => {
    if (!activeEventId && events.length > 0) {
      setActiveEventId(events[0].id);
    }
  }, [events, activeEventId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeEventId]);

  if (!currentUser) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <p style={{ color: 'var(--primary-light)', fontSize: '1.1rem' }}>Please log in to view chats</p>
        <button className="btn-primary" onClick={() => navigate('/login')}>Sign In</button>
      </div>
    );
  }

  const activeEvent = events.find(e => e.id === activeEventId) || events[0];
  const activeChat = activeEvent ? (chats[activeEvent.id] || []) : [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeEventId) return;
    sendMessage(activeEventId, message.trim());
    setMessage('');
  };

  return (
    <div className="page-enter" style={{ display: 'flex', height: 'calc(100vh - 64px)', background: 'var(--bg-deep)' }}>
      {/* Sidebar */}
      <div style={{
        width: '320px', background: 'var(--bg-glass)', borderRight: '1px solid var(--border-light)',
        display: 'flex', flexDirection: 'column'
      }} className="chat-sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>Messages</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="input-field" style={{ paddingLeft: '38px', padding: '10px 10px 10px 38px', fontSize: '0.85rem' }} placeholder="Search chats..." />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {events.map((e) => {
            const isActive = activeEventId === e.id;
            const lastMsg = chats[e.id]?.length ? chats[e.id][chats[e.id].length - 1] : { text: 'No messages yet', time: '' };
            return (
              <div
                key={e.id}
                onClick={() => { setActiveEventId(e.id); navigate(`/chat/${e.id}`, { replace: true }); }}
                style={{
                  padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border-light)',
                  background: isActive ? 'var(--bg-hover)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: isActive ? 700 : 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    {e.title}
                  </span>
                  <span style={{ color: isActive ? 'var(--primary-light)' : 'var(--text-muted)', fontSize: '0.75rem' }}>{lastMsg.time}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                  {lastMsg.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-deep)' }}>
        {activeEvent ? (
          <>
            {/* Chat header */}
            <div style={{ padding: '16px 24px', background: 'var(--bg-glass)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button className="mobile-only" style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none' }} onClick={() => setActiveEventId(null)}>
                  <ArrowLeft size={20} />
                </button>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden' }}>
                  <img src={activeEvent.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Hash size={16} color="var(--primary-light)" /> {activeEvent.title}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} /> {activeEvent.registered} participants
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ background: 'var(--bg-hover)', border: 'none', width: '36px', height: '36px', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Info size={18} />
                </button>
                <button style={{ background: 'var(--bg-hover)', border: 'none', width: '36px', height: '36px', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <span className="badge" style={{ background: 'var(--border-medium)', color: 'var(--text-muted)' }}>Yesterday</span>
              </div>
              
              {activeChat.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                  No messages yet. Be the first to say hello!
                </div>
              ) : (
                activeChat.map((msg, i) => {
                  const isMine = msg.senderId === currentUser.id;
                  const showAvatar = i === 0 || activeChat[i - 1].senderId !== msg.senderId;
                  
                  return (
                    <div key={msg.id} style={{ display: 'flex', gap: '12px', flexDirection: isMine ? 'row-reverse' : 'row', alignItems: 'flex-end', animation: 'scaleIn 0.2s ease' }}>
                      {showAvatar ? (
                        <img src={msg.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-medium)' }} />
                      ) : (
                        <div style={{ width: '32px' }} />
                      )}
                      
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                        {showAvatar && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px', marginLeft: isMine ? 0 : '4px', marginRight: isMine ? '4px' : 0 }}>
                          {isMine ? 'You' : msg.senderName} • {msg.time}
                        </span>}
                        <div className={isMine ? 'chat-bubble-own' : 'chat-bubble-other'} style={{ padding: '12px 16px', fontSize: '0.9rem', lineHeight: 1.5 }}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '20px 24px', background: 'var(--bg-glass)', borderTop: '1px solid var(--border-light)', backdropFilter: 'blur(10px)' }}>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder={`Message #${activeEvent.title}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ flex: 1, borderRadius: '99px', padding: '12px 20px' }}
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="btn-primary"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, justifyContent: 'center', opacity: message.trim() ? 1 : 0.5 }}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '24px', textAlign: 'center' }}>
            Select a chat from the sidebar to start messaging.
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .chat-sidebar {
            position: absolute; left: 0; top: 0; bottom: 0; z-index: 10;
            width: 100% !important;
            display: ${activeEventId ? 'none' : 'flex'} !important;
          }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
