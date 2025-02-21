import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AllergiesForm from "../components/AllergiesForm.tsx";

const AllergiesPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Remove the token query parameter from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleAllergyAdded = async () => {
    // After adding allergies, redirect to dashboard
    navigate("/");
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <h1 className="text-2xl font-bold text-center">Add Allergies</h1>
      </div>
      <div className="h-[calc(100vh-64px)] overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4">
          <AllergiesForm onAllergyAdded={handleAllergyAdded} />
        </div>
      </div>
    </div>
  );
};

export default AllergiesPage;
