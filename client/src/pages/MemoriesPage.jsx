import { useState } from 'react';
import { Camera, Heart, MessageCircle, Share2, MoreHorizontal, X, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import FloatingBackground from '../components/FloatingBackground';

export default function MemoriesPage() {
  const { memories, currentUser, showNotification, events } = useApp();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [form, setForm] = useState({ eventId: '', caption: '', image: null });

  const handleLike = (e) => {
    const btn = e.currentTarget;
    btn.style.color = '#EF4444';
    const icon = btn.querySelector('svg');
    icon.style.fill = '#EF4444';
    icon.style.transform = 'scale(1.2)';
    setTimeout(() => { icon.style.transform = 'scale(1)'; }, 200);
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-deep)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <FloatingBackground intensity={0.5} />
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Memory Wall</h1>
            <p style={{ color: 'var(--text-muted)' }}>Share and relive moments</p>
          </div>
          {currentUser && (
            <button className="btn-primary btn-ripple" onClick={() => setUploadOpen(true)}>
              <Camera size={16} /> Share Memory
            </button>
          )}
        </div>

        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {memories.map(mem => (
            <div key={mem.id} className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={mem.author.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{mem.author.name}</h3>
                    <p style={{ color: 'var(--primary-light)', fontSize: '0.75rem', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={10} /> {mem.eventTitle}
                    </p>
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreHorizontal size={18} /></button>
              </div>

              <div style={{ width: '100%', aspectRatio: '4/3', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
                <img src={mem.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                  <button onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s' }}>
                    <Heart size={22} style={{ transition: 'all 0.2s' }} /> <span style={{ fontWeight: 600 }}>{mem.likes}</span>
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    <MessageCircle size={22} /> <span style={{ fontWeight: 600 }}>{mem.comments.length}</span>
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', marginLeft: 'auto' }}>
                    <Share2 size={20} />
                  </button>
                </div>

                <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '8px', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700, marginRight: '8px' }}>{mem.author.name}</span>
                  {mem.caption}
                </p>

                {mem.comments.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    {mem.comments.map(c => (
                      <p key={c.id} style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600, marginRight: '6px' }}>{c.author}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{c.text}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {uploadOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--overlay)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '24px', position: 'relative', animation: 'scaleIn 0.3s ease' }}>
            <button onClick={() => setUploadOpen(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'var(--bg-hover)', border: 'none', color: 'var(--text-muted)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16} />
            </button>
            <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '24px' }}>Share Memory</h2>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
              <img src={currentUser?.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{currentUser?.name}</p>
              </div>
            </div>

            <select className="input-field" style={{ marginBottom: '16px' }} value={form.eventId} onChange={e => setForm({...form, eventId: e.target.value})}>
              <option value="">Select Event...</option>
              {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>

            <textarea className="input-field" rows={3} placeholder="Write a caption..." style={{ marginBottom: '16px', resize: 'none' }} value={form.caption} onChange={e => setForm({...form, caption: e.target.value})} />

            <div style={{ width: '100%', height: '160px', border: '2px dashed var(--border-medium)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', background: 'var(--bg-hover)' }}>
              <ImageIcon size={32} color="var(--primary-light)" />
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click or drag photo here</p>
            </div>

            <button className="btn-primary btn-ripple" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { showNotification('Memory shared!', 'success'); setUploadOpen(false); }}>
              Post Memory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// Quick inline component
function MapPin(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
}
