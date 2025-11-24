// Firebase initialization
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOgFExVilmxEcX1F2zUW-218xqMrMz3gg",
  authDomain: "togethr-app-b86a6.firebaseapp.com",
  projectId: "togethr-app-b86a6",
  storageBucket: "togethr-app-b86a6.firebasestorage.app",
  messagingSenderId: "957409980158",
  appId: "1:957409980158:web:17d2c39d99509f8f083faf"
};

// Initialize Firebase app (guard against multiple inits)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Export commonly used services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
