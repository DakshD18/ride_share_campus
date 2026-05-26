// src/services/firestoreApi.js
// ─────────────────────────────────────────────────────────────────────────────
// All Firestore read/write operations for the ride-sharing app.
// Keeps database logic out of UI components.
// ─────────────────────────────────────────────────────────────────────────────
import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Save / merge user profile into Firestore on login.
 * Uses set with merge so existing fields (like avgRating) aren't overwritten.
 */
export async function saveUserProfile(user) {
  const ref = doc(db, 'users', user.uid);
  await setDoc(ref, {
    name:       user.displayName || user.name || user.email?.split('@')[0] || 'User',
    email:      user.email || '',
    photoURL:   user.photoURL || '',
    updatedAt:  serverTimestamp(),
  }, { merge: true });

  // Ensure defaults exist for new users
  const snap = await getDoc(ref);
  if (!snap.data()?.createdAt) {
    await updateDoc(ref, {
      createdAt:  serverTimestamp(),
      avgRating:  0,
      totalRides: 0,
      role:       '',   // will be set on role-select
    });
  }
}

/**
 * Set the user's current role (driver / passenger).
 */
export async function setUserRole(uid, role) {
  await updateDoc(doc(db, 'users', uid), { role });
}

/**
 * Get a user's profile.
 */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
}


// ─────────────────────────────────────────────────────────────────────────────
// RIDES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Driver posts a new ride (offer).
 * Returns the auto-generated Firestore document ID.
 */
export async function postRide({
  driverId,
  driverName,
  pickup,
  destination,
  pickupCoords,
  destCoords,
  time,
  seats,
  fare,
}) {
  const docRef = await addDoc(collection(db, 'rides'), {
    type:          'offer',      // driver-initiated ride offer
    driverId,
    driverName,
    passengerId:   null,
    passengerName: null,
    pickup,
    destination,
    pickupCoords:  pickupCoords || null,
    destCoords:    destCoords || null,
    time:          time || '',
    seats:         seats || 1,
    fare:          fare || 0,
    status:        'available',
    otp:           null,
    driverLat:     pickupCoords?.lat || null,
    driverLng:     pickupCoords?.lng || null,
    createdAt:     serverTimestamp(),
    completedAt:   null,
    rating:        null,
  });
  return docRef.id;
}

/**
 * Estimate fare based on distance between two coordinates.
 * Uses Haversine formula. Base ₹10 + ₹8 per km, minimum ₹15.
 */
function estimateFare(pickupCoords, destCoords) {
  if (!pickupCoords || !destCoords) return 15; // default minimum fare
  const R = 6371; // Earth radius in km
  const dLat = (destCoords.lat - pickupCoords.lat) * Math.PI / 180;
  const dLng = (destCoords.lng - pickupCoords.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(pickupCoords.lat * Math.PI / 180) *
    Math.cos(destCoords.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distKm = R * c;
  const fare = Math.round(10 + distKm * 8); // ₹10 base + ₹8/km
  return Math.max(fare, 15); // minimum ₹15
}

/**
 * Passenger posts a ride request.
 * Returns the auto-generated Firestore document ID.
 */
export async function postRideRequest({
  passengerId,
  passengerName,
  pickup,
  destination,
  pickupCoords,
  destCoords,
}) {
  const fare = estimateFare(pickupCoords, destCoords);
  const docRef = await addDoc(collection(db, 'rides'), {
    type:          'request',    // passenger-initiated ride request
    driverId:      null,
    driverName:    null,
    passengerId,
    passengerName,
    pickup,
    destination,
    pickupCoords:  pickupCoords || null,
    destCoords:    destCoords || null,
    time:          'Now',
    seats:         1,
    fare,
    status:        'requested',  // waiting for driver to accept
    otp:           null,
    driverLat:     null,
    driverLng:     null,
    createdAt:     serverTimestamp(),
    completedAt:   null,
    rating:        null,
  });
  return docRef.id;
}

/**
 * Passenger cancels their ride (works for requested, booked, or in_progress).
 */
export async function cancelRideByPassenger(rideId) {
  await updateDoc(doc(db, 'rides', rideId), {
    status: 'cancelled',
    completedAt: serverTimestamp(),
  });
}

/**
 * Fetch all available rides (status === 'available').
 */
export async function fetchAvailableRides() {
  const q = query(
    collection(db, 'rides'),
    where('status', '==', 'available')
  );
  const snap = await getDocs(q);
  const rides = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // Sort manually client-side instead of requiring Firestore composite index
  return rides.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
}

/**
 * Passenger books a driver-offered ride.
 * Sets status to "booked", stores passenger info and a 4-digit OTP.
 */
export async function bookRide(rideId, passengerUid, passengerName) {
  const otp = String(Math.floor(1000 + Math.random() * 9000)); // 4-digit
  await updateDoc(doc(db, 'rides', rideId), {
    passengerId:   passengerUid,
    passengerName: passengerName || '',
    status:        'booked',
    otp,
  });
  return otp;
}

/**
 * Driver accepts a passenger's ride request.
 * Sets driverId, status to "booked", and generates a 4-digit OTP.
 */
export async function acceptRideRequest(rideId, driverUid, driverName) {
  const otp = String(Math.floor(1000 + Math.random() * 9000)); // 4-digit
  await updateDoc(doc(db, 'rides', rideId), {
    driverId:    driverUid,
    driverName:  driverName || '',
    status:      'booked',
    otp,
  });
  return otp;
}

/**
 * Driver declines a passenger's ride request.
 * Resets driverId so other drivers can pick it up, or marks it declined.
 */
export async function declineRideRequest(rideId) {
  // Just reset so other drivers can see it (or delete)
  // For now we mark it cancelled
  await updateDoc(doc(db, 'rides', rideId), {
    status: 'cancelled',
  });
}

/**
 * Verify OTP entered by driver.
 * Returns { success: true } or { success: false, error: string }.
 */
export async function verifyRideOTP(rideId, enteredOTP) {
  const snap = await getDoc(doc(db, 'rides', rideId));
  if (!snap.exists()) return { success: false, error: 'Ride not found' };

  const ride = snap.data();
  if (ride.otp === enteredOTP) {
    await updateDoc(doc(db, 'rides', rideId), { status: 'started' });
    return { success: true };
  }
  return { success: false, error: 'Incorrect OTP. Please try again.' };
}

/**
 * Update ride status.
 */
export async function updateRideStatus(rideId, status) {
  const updates = { status };
  if (status === 'completed') {
    updates.completedAt = serverTimestamp();
  }
  await updateDoc(doc(db, 'rides', rideId), updates);
}

/**
 * Update driver's live GPS position on a ride.
 */
export async function updateDriverLocation(rideId, lat, lng) {
  await updateDoc(doc(db, 'rides', rideId), {
    driverLat: lat,
    driverLng: lng,
  });
}

/**
 * Listen to a single ride document in real-time.
 * Returns an unsubscribe function.
 */
export function listenToRide(rideId, callback) {
  return onSnapshot(doc(db, 'rides', rideId), (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() });
    }
  });
}

/**
 * Listen to rides where this driver is assigned (their own offers + accepted requests).
 * Returns an unsubscribe function.
 */
export function listenToDriverRides(driverUid, callback) {
  const q = query(
    collection(db, 'rides'),
    where('driverId', '==', driverUid),
    where('status', 'in', ['available', 'booked', 'started', 'in_progress']),
  );
  return onSnapshot(q, (snap) => {
    const rides = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(rides);
  });
}

/**
 * Listen to ALL pending passenger ride requests (status === 'requested').
 * Drivers see these and can accept/decline them.
 * Returns an unsubscribe function.
 */
export function listenToRideRequests(callback) {
  const q = query(
    collection(db, 'rides'),
    where('status', '==', 'requested'),
  );
  return onSnapshot(q, (snap) => {
    const rides = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(rides);
  });
}

/**
 * Listen to a passenger's active ride (booked, requested, started, or in_progress).
 */
export function listenToPassengerRide(passengerUid, callback) {
  const q = query(
    collection(db, 'rides'),
    where('passengerId', '==', passengerUid),
    where('status', 'in', ['requested', 'booked', 'started', 'in_progress']),
  );
  return onSnapshot(q, (snap) => {
    const rides = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(rides.length > 0 ? rides[0] : null);
  });
}

/**
 * Fetch ride history for a user (completed/cancelled rides).
 */
export async function fetchRideHistory(uid, role = 'passenger') {
  const field = role === 'driver' ? 'driverId' : 'passengerId';
  const q = query(
    collection(db, 'rides'),
    where(field, '==', uid),
    where('status', 'in', ['completed', 'cancelled'])
  );
  const snap = await getDocs(q);
  const rides = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // Sort manually client-side
  return rides.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
}


// ─────────────────────────────────────────────────────────────────────────────
// RATINGS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Submit a rating after ride completion.
 */
export async function submitRating({ rideId, fromUid, toUid, rating, comment = '' }) {
  await addDoc(collection(db, 'ratings'), {
    rideId,
    fromUid,
    toUid,
    rating,
    comment,
    createdAt: serverTimestamp(),
  });

  // Update the target user's average rating
  const userRef = doc(db, 'users', toUid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    const oldTotal = data.totalRides || 0;
    const oldAvg   = data.avgRating  || 0;
    const newTotal  = oldTotal + 1;
    const newAvg    = ((oldAvg * oldTotal) + rating) / newTotal;
    await updateDoc(userRef, {
      avgRating:  Math.round(newAvg * 10) / 10,
      totalRides: newTotal,
    });
  }
}
