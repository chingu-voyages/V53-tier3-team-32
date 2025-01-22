import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin.tsx";
import Signup from "./pages/Signup.tsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<div>Welcome to the Dashboard</div>} />
      </Routes>
    </Router>
  );
};

export default App;
