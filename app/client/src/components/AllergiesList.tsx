import React from "react";
import { Allergy } from "../models/interface/IAllergy";
import { Link } from "react-router-dom";

interface AllergiesListProps {
  allergies: Allergy[];
}

const AllergiesList: React.FC<AllergiesListProps> = ({ allergies }) => {
  // Group allergies by category and combine duplicates
  const groupedAllergies = allergies.reduce((acc, allergy) => {
    if (!acc[allergy.category]) {
      acc[allergy.category] = new Map();
    }

    // If allergy already exists, add to its count, otherwise create new entry
    const existingCount = acc[allergy.category].get(
      allergy.name.toLowerCase()
    ) || {
      name: allergy.name,
      count: 0,
    };

    acc[allergy.category].set(allergy.name.toLowerCase(), {
      name: allergy.name,
      count: existingCount.count + allergy.count,
    });

    return acc;
  }, {} as Record<string, Map<string, { name: string; count: number }>>);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Allergies</h2>
        <Link
          to="/allergies"
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          Add New
        </Link>
      </div>
      {Object.keys(groupedAllergies).length === 0 ? (
        <p className="text-gray-500">No allergies found.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedAllergies).map(([category, allergyMap]) => (
            <div key={category} className="border-b pb-2">
              <h3 className="text-sm font-medium mb-1 capitalize text-gray-600">
                {category}
              </h3>
              <ul className="space-y-1">
                {Array.from(allergyMap.values()).map((allergy, index) => (
                  <li key={index} className="text-sm flex justify-between">
                    <span className="capitalize">{allergy.name}</span>
                    <span className="text-gray-500 text-xs">
                      ({allergy.count})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllergiesList;
