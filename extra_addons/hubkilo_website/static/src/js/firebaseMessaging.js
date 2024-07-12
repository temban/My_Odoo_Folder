import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging.js';

const firebaseConfig = {
    apiKey: "AIzaSyAMz8Ri4s0UUammWHHcCZroXh_HFuFFzmI",
    authDomain: "hubkilo-51f7a.firebaseapp.com",
    projectId: "hubkilo-51f7a",
    storageBucket: "hubkilo-51f7a.appspot.com",
    messagingSenderId: "368365207810",
    appId: "1:368365207810:web:af5fd629aa32b19f80c21b"
};

// Initialize Firebase
try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firebase Cloud Messaging and get a reference to the service
  const messaging = getMessaging(app);
  console.log('Firebase initialized successfully');

  // Request notification permission
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      // Permission granted, you can now retrieve the FCM token
      getToken(messaging)
        .then((token) => {
          console.log("FCM Token:", token);
        })
        .catch((error) => {
          console.error("Error getting FCM token:", error);
        });
    } else {
      console.error("Notification permission denied");
    }
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
}

if ("serviceWorker" in navigator) {
  const swUrl = new URL("/hubkilo_website/static/src/js/firebase-messaging-sw.js", window.location.href);

  navigator.serviceWorker
    .register(swUrl.toString())
    .then(function (registration) {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch(function (error) {
      console.error("Service Worker registration failed:", error);
    });
}

