// src/components/Register.js

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { Link, useNavigate} from "react-router-dom"; // ✅ make sure react-router-dom is used
import "../styles/Register.css"; // ✅ import your styles

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await axios.post(
        "https://be-url-shortener.onrender.com/api/sync-user",
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      

      setMessage("Registered successfully.");
      navigate("/Login");
    } catch (error) {
      console.error("Registration failed:", error.message);
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      <form onSubmit={handleRegister} className="register-form">
        <label>Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
        />

        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your Password"
        />

        <button type="submit">Register</button>
      </form>

      {message && <p className="register-message">{message}</p>}

      <p className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
