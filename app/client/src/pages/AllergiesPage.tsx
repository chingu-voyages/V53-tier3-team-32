import React, { useState, useEffect } from "react";

const AllergiesPage: React.FC = () => {
  const [allergyInput, setAllergyInput] = useState("");
  const [topAllergies, setTopAllergies] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const addAllergy = async () => {
    if (!allergyInput.trim()) return;
    try {
      const response = await fetch("http://localhost:3000/api/allergy/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: allergyInput.trim() }),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert(data.msg || "Allergy added");
        setAllergyInput("");
        fetchTopAllergies();
      } else {
        alert(data.msg || "Error adding allergy");
      }
    } catch (error) {
      console.error("Error adding allergy:", error);
      alert("Error adding allergy");
    }
  };

  const fetchTopAllergies = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/allergy/top5", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch allergies");
      }
      
      const data = await response.json();
      setTopAllergies(data.allergies || []);
    } catch (error) {
      console.error("Error fetching top allergies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopAllergies();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Allergies</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your allergy"
          value={allergyInput}
          onChange={(e) => setAllergyInput(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={addAllergy}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Allergy
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Top 5 Allergies</h2>
      {loading ? (
        <p>Loading allergies...</p>
      ) : topAllergies.length === 0 ? (
        <p>No allergies found.</p>
      ) : (
        <ul className="list-disc list-inside">
          {topAllergies.map((allergy, index) => (
            <li key={index}>
              {allergy.name} – Count: {allergy.count}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllergiesPage;