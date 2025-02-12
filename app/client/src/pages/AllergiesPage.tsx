import React from "react";
import { useNavigate } from "react-router-dom";
import AllergiesForm from "../components/AllergiesForm.tsx";

const AllergiesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAllergyAdded = async () => {
    // After adding allergies, redirect to dashboard
    navigate("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Allergies</h1>
      <AllergiesForm onAllergyAdded={handleAllergyAdded} />
    </div>
  );
};

export default AllergiesPage;
