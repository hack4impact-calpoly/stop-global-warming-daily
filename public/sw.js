self.addEventListener("push", function (event) {
  let data = {
    title: "Test Notification",
    body: "You have a new message.",
    icon: "/icon.png",
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icon.png",
    badge: "/badge.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "2",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// TODO: actually add in images and website links
