import React from "react";
import { Link } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

const Signin = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <h1 className="text-6xl font-bold text-center mb-6">MEAL PLANNER</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
        <div className="text-center mt-6">
          <button className="w-full flex items-center justify-center bg-white border p-3 rounded mb-4">
            <GoogleIcon className="h-5 w-5 mr-2" />
            Signin with Google
          </button>
          <button className="w-full flex items-center justify-center bg-white border p-3 rounded mb-4">
            <GitHubIcon className="h-5 w-5 mr-2" />
            Signin with GitHub
          </button>
        </div>
        <h2 className="text-sm font-semibold text-center mb-4">-OR-</h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="password"
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
