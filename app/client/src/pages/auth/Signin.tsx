import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

const Signin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/");
    }
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://menu-scheduler-backend.onrender.com/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user information and token in local storage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        // Successful signin, redirect to dashboard
        navigate("/");
      } else {
        alert(data.message || "Signin failed");
      }
    } catch (err) {
      console.error("Error during signin:", err);
      alert("An error occurred during signin");
    }
  };

  // OAuth handlers
  const handleGoogleSignin = () => {
    window.location.href = "https://menu-scheduler-backend.onrender.com/auth/google/";
  };

  const handleGithubSignin = () => {
    window.location.href = "https://menu-scheduler-backend.onrender.com/auth/github/";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <h1 className="text-6xl font-bold text-center mb-6">MEAL PLANNER</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
        <div className="text-center mt-6">
          <button 
            onClick={handleGoogleSignin}
            className="w-full flex items-center justify-center bg-white border p-3 rounded mb-4"
          >
            <GoogleIcon className="h-5 w-5 mr-2" />
            Signin with Google
          </button>
          <button 
            onClick={handleGithubSignin}
            className="w-full flex items-center justify-center bg-white border p-3 rounded mb-4"
          >
            <GitHubIcon className="h-5 w-5 mr-2" />
            Signin with GitHub
          </button>
        </div>
        <h2 className="text-sm font-semibold text-center mb-4">-OR-</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="identifier" 
            value={form.identifier}
            onChange={handleChange}
            placeholder="Username or Email"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;