// src/components/RatingModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Post-ride star rating modal. Shown to both passenger and driver after
// the ride is completed.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import { submitRating } from '../services/firestoreApi';

const RatingModal = ({ rideId, fromUid, toUid, toName, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await submitRating({ rideId, fromUid, toUid, rating, comment });
      setDone(true);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error('Rating submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!rideId) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes starPop { 0% { transform: scale(0.5) } 50% { transform: scale(1.3) } 100% { transform: scale(1) } }
        .rating-star { transition: all 0.15s; cursor: pointer; }
        .rating-star:hover { transform: scale(1.2) !important; }
        .rating-star.active { animation: starPop 0.3s ease forwards; }
      `}</style>

      <div style={{
        width: '100%', maxWidth: '420px', margin: '0 1rem',
        background: 'rgba(14,14,36,0.95)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem',
        padding: '2rem', animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '50%', width: '32px', height: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#706d8a',
        }}><X size={16} /></button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎉</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80', fontFamily: "'Space Grotesk', sans-serif" }}>
              Thank you!
            </div>
            <div style={{ fontSize: '0.85rem', color: '#706d8a', marginTop: '0.3rem' }}>
              Your rating has been submitted.
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f0ff', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '0.3rem' }}>
                Rate your ride
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#706d8a' }}>
                How was your experience with <strong style={{ color: '#b8b5d0' }}>{toName}</strong>?
              </p>
            </div>

            {/* Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}
                  className={`rating-star ${i <= rating ? 'active' : ''}`}
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(0)}
                  style={{ padding: '0.25rem' }}
                >
                  <Star
                    size={36}
                    fill={i <= (hovered || rating) ? '#f59e0b' : 'transparent'}
                    color={i <= (hovered || rating) ? '#f59e0b' : '#334155'}
                    strokeWidth={1.5}
                  />
                </div>
              ))}
            </div>

            {/* Rating label */}
            {rating > 0 && (
              <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600 }}>
                {['', 'Poor', 'Below Average', 'Good', 'Very Good', 'Excellent'][rating]}
              </div>
            )}

            {/* Comment */}
            <textarea
              placeholder="Add a comment (optional)..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '0.85rem 1rem',
                background: 'rgba(6,6,15,0.7)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '0.75rem', color: '#f1f0ff', fontSize: '0.9rem',
                outline: 'none', resize: 'none', fontFamily: 'inherit',
                marginBottom: '1.25rem',
              }}
            />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
              style={{
                width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: 'none',
                cursor: rating === 0 || submitting ? 'not-allowed' : 'pointer',
                background: rating > 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.05)',
                color: rating > 0 ? 'white' : '#334155',
                fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.2s',
                boxShadow: rating > 0 ? '0 4px 16px rgba(245,158,11,0.35)' : 'none',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              <Send size={16} />
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RatingModal;
