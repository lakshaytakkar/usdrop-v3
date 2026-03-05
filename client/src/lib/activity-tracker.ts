import { getAccessToken } from './supabase';

type ActivityType = 'page_view' | 'lesson_complete' | 'login' | 'signup' | 'feature_click';

const trackedPages = new Set<string>();

export function trackActivity(type: ActivityType, data?: Record<string, any>) {
  const token = getAccessToken();
  if (!token) return;

  if (type === 'page_view') {
    const pageKey = data?.path || window.location.pathname;
    if (trackedPages.has(pageKey)) return;
    trackedPages.add(pageKey);
  }

  fetch('/api/activity/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ activity_type: type, activity_data: data || {} }),
  }).catch(() => {});
}

export function resetPageTracking() {
  trackedPages.clear();
}
