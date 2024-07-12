// Assuming you have obtained the Firebase Web API key
const firebaseConfig = {
apiKey: "AIzaSyAQ6wNsNHrnUXUNwwlXmtusV9wf8pH_keo",
				authDomain: "push-n-ea6b0.firebaseapp.com",
				projectId: "push-n-ea6b0",
				storageBucket: "push-n-ea6b0.appspot.com",
				messagingSenderId: "393779413412",
				appId: "1:393779413412:web:fd9e9e167222e6e3dc8131",
				measurementId: "G-TB448BZN5N"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Request permission to show notifications
messaging.requestPermission().then(() => {
  console.log('Notification permission granted.');

  // Get the current FCM token
  return messaging.getToken();
}).then((token) => {
  console.log('FCM Token:', token);
  // Send the token to your server for association with the user
  // You can use AJAX to send the token to your Odoo backend
}).catch((error) => {
  console.log('Unable to get permission or token:', error);
});

// Handle incoming messages and show notifications
messaging.onMessage((payload) => {
  const notification = payload.notification;
  new Notification(notification.title, {
    body: notification.body
  });
});
