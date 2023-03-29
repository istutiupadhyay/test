import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/user/signup", {
        email,
        mobile,
        password,
      });
      if (res.data.status === "success") {
        alert("Account created successfully. Please check your email .");
        window.location.href = "./login_component.js"
        sendConfirmationEmail(res.data.email)
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email address:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div>
          <label>Confirm password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>

        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default Signup;


const sendConfirmationEmail = async (email) => {
    try {
      const res = await axios.post("http://localhost:4000/user/mail", { email });
      if (res.data.status === "success") {
        alert("Confirmation email sent. Please check your inbox.");
      }
    } catch (err) {
      alert("Failed to send confirmation email.");
    }
  };

