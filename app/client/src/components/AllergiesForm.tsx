import React, { useState } from "react";
interface AllergiesFormProps {
  onAllergyAdded: () => Promise<void>;
}

const AllergiesForm: React.FC<AllergiesFormProps> = ({ onAllergyAdded }) => {
  const [allergies, setAllergies] = useState({
    fruits: "",
    vegetables: "",
    dairy: "",
    meat: "",
    grains: "",
    spices: "",
    beverages: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAllergies({ ...allergies, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create an array of allergy objects
    const allergyData = Object.entries(allergies).map(([category, name]) => ({
      name: name.trim(),
      category
    })).filter(allergy => allergy.name !== ""); // Only include non-empty allergies
  
    try {
      const response = await fetch("http://localhost:3000/api/allergy/add-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(allergyData),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.msg || "Allergies added");
        setAllergies({
          fruits: "",
          vegetables: "",
          dairy: "",
          meat: "",
          grains: "",
          spices: "",
          beverages: "",
        });
        await onAllergyAdded();
      } else {
        alert(data.msg || "Error adding allergies");
      }
    } catch (error) {
      console.error("Error adding allergies:", error);
      alert("Error adding allergies");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Allergies</h1>
      {Object.keys(allergies).map((category) => (
        <div key={category} className="mb-4">
          <label className="block mb-2">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </label>
          <input
            type="text"
            name={category}
            value={allergies[category as keyof typeof allergies]}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder={`Enter ${category}`}
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Allergies
      </button>
    </form>
  );
};

export default AllergiesForm;
