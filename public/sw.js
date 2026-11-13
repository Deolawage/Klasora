self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(self.registration.showNotification(data.title || 'Klasora', {
    body: data.body || 'New message',
    icon: '/klasora-logo.png',
    badge: '/klasora-logo.png',
    data: data.data || {}
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const requestedUrl = new URL(e.notification.data?.url || '/', self.location.origin);
  const url = requestedUrl.origin === self.location.origin ? requestedUrl : new URL('/', self.location.origin);
  e.waitUntil(clients.openWindow(url.href));
});
