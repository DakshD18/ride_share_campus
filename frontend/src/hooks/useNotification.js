// src/hooks/useNotification.js
// ─────────────────────────────────────────────────────────────────────────────
// Browser Notification API hook for ride event alerts.
// Requests permission on mount and exposes a `notify` function.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useCallback, useRef } from 'react';

export function useNotification() {
  const permissionRef = useRef(Notification?.permission || 'default');

  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        permissionRef.current = perm;
      });
    } else {
      permissionRef.current = Notification.permission;
    }
  }, []);

  const notify = useCallback((title, body, icon = '🚗') => {
    if (!('Notification' in window)) return;
    if (permissionRef.current !== 'granted') return;

    try {
      new Notification(title, {
        body,
        icon: icon.startsWith('http') ? icon : undefined,
        badge: '/favicon.ico',
        tag: `ridecampus-${Date.now()}`,
        silent: false,
      });
    } catch (err) {
      // Fallback — some mobile browsers don't support new Notification()
      console.warn('Notification failed:', err);
    }
  }, []);

  return { notify };
}
