// src/components/PaymentModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Post-ride UPI payment modal. Shows a QR code for UPI payment and a
// "Mark as Paid" confirmation button for the driver side.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle, IndianRupee, QrCode, Smartphone } from 'lucide-react';

/**
 * @param {object} props
 * @param {number} props.fare        – ride fare in INR
 * @param {string} props.driverName  – driver's display name
 * @param {string} props.driverUpi   – driver's UPI ID (e.g. name@upi)
 * @param {'passenger'|'driver'} props.role – who is viewing
 * @param {function} props.onPaid    – callback when payment is confirmed
 * @param {function} props.onClose   – close the modal
 */
const PaymentModal = ({ fare = 0, driverName = 'Driver', driverUpi = '', role = 'passenger', onPaid, onClose }) => {
  const [confirming, setConfirming] = useState(false);
  const [paid, setPaid] = useState(false);

  // Build UPI deep-link
  const upiLink = driverUpi
    ? `upi://pay?pa=${encodeURIComponent(driverUpi)}&pn=${encodeURIComponent(driverName)}&am=${fare}&cu=INR&tn=${encodeURIComponent('RideCampus Ride Payment')}`
    : '';

  const handleMarkPaid = async () => {
    setConfirming(true);
    try {
      if (onPaid) await onPaid();
      setPaid(true);
      setTimeout(() => onClose(), 1800);
    } catch (err) {
      console.error('Payment confirmation error:', err);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes checkPop { 0% { transform: scale(0) } 50% { transform: scale(1.2) } 100% { transform: scale(1) } }
      `}</style>

      <div style={{
        width: '100%', maxWidth: '420px', margin: '0 1rem',
        background: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem',
        padding: '2rem', animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: '0 30px 70px rgba(0,0,0,0.6)', position: 'relative',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50%', width: '32px', height: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#64748b',
        }}><X size={16} /></button>

        {paid ? (
          /* ── Success state ── */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
              animation: 'checkPop 0.5s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <CheckCircle size={36} color="white" />
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399', fontFamily: "'Syne', sans-serif", marginBottom: '0.4rem' }}>
              Payment Confirmed!
            </div>
            <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
              ₹{fare} paid to {driverName}
            </div>
          </div>
        ) : (
          /* ── Payment UI ── */
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 0.75rem',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))',
                border: '1px solid rgba(139,92,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IndianRupee size={26} color="#a78bfa" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne', sans-serif", marginBottom: '0.3rem' }}>
                Ride Payment
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                {role === 'passenger' ? 'Scan the QR code to pay via UPI' : 'Confirm payment from passenger'}
              </p>
            </div>

            {/* Fare display */}
            <div style={{
              background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
              borderRadius: '1rem', padding: '1rem', textAlign: 'center', marginBottom: '1.25rem',
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                Amount Due
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em' }}>
                ₹{fare}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.15rem' }}>
                Pay to: <strong style={{ color: '#94a3b8' }}>{driverName}</strong>
              </div>
            </div>

            {/* QR Code (passenger view) */}
            {role === 'passenger' && upiLink && (
              <div style={{
                background: 'white', borderRadius: '1rem', padding: '1.25rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                marginBottom: '1.25rem',
              }}>
                <QRCodeSVG
                  value={upiLink}
                  size={200}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem' }}>
                  <Smartphone size={14} color="#64748b" />
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Scan with any UPI app</span>
                </div>
              </div>
            )}

            {/* UPI ID display */}
            {driverUpi && (
              <div style={{
                background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem', padding: '0.85rem 1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>UPI ID</div>
                  <div style={{ fontSize: '0.95rem', color: '#e2e8f0', fontWeight: 600, fontFamily: 'monospace' }}>{driverUpi}</div>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(driverUpi); }}
                  style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem', padding: '0.5rem 0.85rem', cursor: 'pointer',
                    color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'inherit',
                  }}
                >
                  Copy
                </button>
              </div>
            )}

            {/* No UPI set message */}
            {!driverUpi && role === 'passenger' && (
              <div style={{
                background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
                borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
              }}>
                <QrCode size={18} color="#f59e0b" />
                <span style={{ fontSize: '0.82rem', color: '#f59e0b' }}>Driver hasn't set up UPI. Please pay in cash.</span>
              </div>
            )}

            {/* Mark as Paid button */}
            <button
              onClick={handleMarkPaid}
              disabled={confirming}
              style={{
                width: '100%', padding: '0.9rem', borderRadius: '0.75rem', border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                cursor: confirming ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
                transition: 'all 0.2s', opacity: confirming ? 0.7 : 1,
              }}
            >
              <CheckCircle size={16} />
              {confirming ? 'Confirming...' : role === 'driver' ? 'Confirm Payment Received' : 'I Have Paid'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
