// Import the 'auth' object from the Firebase Authentication module
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js";

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";

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



// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

console.log('Firebase initialized successfully');

  // Create a new user with email and password
var email = "xavierlamar197377@gmail.com";
var password = "password123";

createUserWithEmailAndPassword(auth, email, password)
  .then(function(userCredential) {
    // User created successfully
    var user = userCredential.user;
    console.log("User created:", user);
  })
  .catch(function(error) {
    // Handle errors here
    console.error("Error creating user:", error);
  });

} catch (error) {
  console.error('Firebase initialization error:', error);
}


