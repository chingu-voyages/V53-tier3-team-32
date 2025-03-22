import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      try {
        // Verify token structure before storing
        if (
          !token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        ) {
          throw new Error("Invalid token format");
        }

        localStorage.setItem("token", token);

        // Clear query parameters without reloading
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        // Verify token validity before redirect
        const verifyToken = async () => {
          try {
            const response = await fetch(
              "https://menu-scheduler-backend.onrender.com/auth/verify",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) throw new Error("Invalid token");

            // Extract user data and save it
            const data = await response.json();
            if (data.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
            }

            navigate("/");
          } catch (error) {
            console.error("Token verification failed:", error);
            localStorage.removeItem("token");
            navigate("/signin");
          }
        };

        verifyToken();
      } catch (error) {
        console.error("Token processing error:", error);
        localStorage.removeItem("token");
        navigate("/signin");
      }
    }
  }, [navigate]);

  // handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that password === confirmPassword
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://menu-scheduler-backend.onrender.com/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store user information and token in local storage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        // Successful signup, redirect to dashboard
        navigate("/");
      } else {
        // Handle error
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Error during signup:", err);
    }
  };

  // google and github handlers
  const handleGoogleSignup = () => {
    window.location.href =
      "https://menu-scheduler-backend.onrender.com/auth/google/";
  };
  const handleGithubSignup = () => {
    window.location.href =
      "https://menu-scheduler-backend.onrender.com/auth/github/";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <h1 className="text-6xl font-bold text-center mb-6">MEAL PLANNER</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create an Account
        </h2>
        <div className="text-center mt-6">
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center bg-white border p-3 rounded mb-4"
          >
            <GoogleIcon className="h-5 w-5 mr-2" />
            Signup with Google
          </button>
          <button
            onClick={handleGithubSignup}
            className="w-full flex items-center justify-center bg-white border p-3 rounded mb-4"
          >
            <GitHubIcon className="h-5 w-5 mr-2" />
            Signup with GitHub
          </button>
        </div>
        <h2 className="text-sm font-semibold text-center mb-4">-OR-</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
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
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            Signup
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm">
            Have an account?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Signin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
