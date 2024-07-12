importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js');

// Initialize Firebase with your project's config object
firebase.initializeApp({
    apiKey: "AIzaSyAMz8Ri4s0UUammWHHcCZroXh_HFuFFzmI",
    authDomain: "hubkilo-51f7a.firebaseapp.com",
    projectId: "hubkilo-51f7a",
    storageBucket: "hubkilo-51f7a.appspot.com",
    messagingSenderId: "368365207810",
    appId: "1:368365207810:web:af5fd629aa32b19f80c21b"
});

const messaging = firebase.messaging();

// Customize the behavior when a push notification is received while the web app is in the foreground
messaging.onMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Customize the behavior when a push notification is clicked by the user
self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Add custom handling here, such as opening a specific URL or page
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('navigate' in client) {
          return client.navigate('https://example.com'); // Replace with your desired URL
        }
      }
    })
  );
});
