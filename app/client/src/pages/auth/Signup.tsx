import React from "react";
import { Link } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

const Signup = () => {
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
          <button className="w-full flex items-center justify-center bg-white border p-3 rounded mb-4">
          <GoogleIcon className="h-5 w-5 mr-2" />
            Signup with Google
          </button>
          <button className="w-full flex items-center justify-center bg-white border p-3 rounded mb-4">
          <GitHubIcon className="h-5 w-5 mr-2" />
            Signup with GitHub
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
          <input
            type="password"
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
