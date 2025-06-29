import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyD8EzyNVt3o4GxxyOfeaHJnlpxy6JlGPhI",
  authDomain: "url-shortener-18438.firebaseapp.com",
  projectId: "url-shortener-18438",
  storageBucket: "url-shortener-18438.firebasestorage.app",
  messagingSenderId: "140546962726",
  appId: "1:140546962726:web:982c521e0c1b43d1837de7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };