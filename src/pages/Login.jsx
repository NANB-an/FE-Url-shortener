// src/components/Login.js

import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { Link , useNavigate } from "react-router-dom"; // ✅ make sure you're using react-router-dom
import "../styles/Login.css"; // ✅ import your styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await axios.post(
        "https://be-url-shortener.onrender.com/api/sync-user",
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      navigate("/");
    } catch (error) {
      console.error("Email/Password Login failed:", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await axios.post(
        "https://be-url-shortener.onrender.com/api/sync-user",
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      navigate("/");
    } catch (error) {
      console.error("Google Sign-In failed:", error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login with Email</button>
      </form>

      <hr className="login-separator" />

      <button onClick={handleGoogleLogin} className="google-btn">
        Sign in/Register with Google
      </button>

      <p className="register-link">
        Don’t have an account? <Link to="/register">Register Email here</Link>
      </p>
    </div>
  );
};

export default Login;
