// src/services/djangoApi.js
// ─────────────────────────────────────────────────────────────────────────────
// Central utility for all Django backend API calls.
// All functions return { success, data/error } objects — never throw directly.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api';

/**
 * Internal fetch wrapper with JSON handling
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || `HTTP ${response.status}` };
    }
    return { success: true, data };
  } catch (err) {
    console.error(`[djangoApi] ${method} ${endpoint} failed:`, err);
    return { success: false, error: 'Cannot connect to backend. Is Django running?' };
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// OTP APIs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate OTP for a ride.
 * @param {string} rideId       - Firestore ride document ID
 * @param {string} passengerUid - Firebase UID of passenger
 * @param {string} driverUid    - Firebase UID of driver
 * @returns {{ success, data: { otp, ride_id, expires_in_minutes } }}
 */
export async function generateOTP(rideId, passengerUid = '', driverUid = '') {
  return apiRequest('/generate-otp', 'POST', {
    ride_id:       rideId,
    passenger_uid: passengerUid,
    driver_uid:    driverUid,
  });
}

/**
 * Verify OTP entered by the driver.
 * @param {string} rideId - Firestore ride document ID
 * @param {string} otp    - 4-digit OTP string
 * @returns {{ success, data: { message } | error: string }}
 */
export async function verifyOTP(rideId, otp) {
  return apiRequest('/verify-otp', 'POST', { ride_id: rideId, otp });
}


// ─────────────────────────────────────────────────────────────────────────────
// Ride History API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch ride history for a user.
 * @param {string} uid  - Firebase UID
 * @param {'passenger'|'driver'} role
 * @param {number} page
 * @returns {{ success, data: { rides, count } }}
 */
export async function getRideHistory(uid, role = 'passenger', page = 1) {
  return apiRequest(`/ride-history?uid=${uid}&role=${role}&page=${page}`);
}


// ─────────────────────────────────────────────────────────────────────────────
// Admin Stats API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch summary stats for admin view.
 * @returns {{ success, data: { total_rides, completed_rides, ... } }}
 */
export async function getAdminStats() {
  return apiRequest('/admin/stats');
}
