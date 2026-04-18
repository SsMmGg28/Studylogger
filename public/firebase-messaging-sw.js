self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Çalışma Vakti!";
  const body = data.body || "Uzun zamandır uygulamaya girmedin, hadi çalışmaya başlayalım.";

  const options = {
    body,
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it
      if (windowClients.length > 0) {
        windowClients[0].focus();
        return windowClients[0].navigate(urlToOpen);
      }
      // Otherwise open a new window
      return clients.openWindow(urlToOpen);
    })
  );
});
