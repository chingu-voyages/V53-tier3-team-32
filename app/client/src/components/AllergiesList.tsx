import React from "react";
import { Allergy } from "../models/interface/IAllergy";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface AllergiesListProps {
  allergies: Allergy[];
  onDeleteAllergy?: (allergyId: string) => Promise<void>;
}

const AllergiesList: React.FC<AllergiesListProps> = ({
  allergies,
  onDeleteAllergy,
}) => {
  // Group allergies as you already do...
  const groupedAllergies = allergies.reduce((acc, allergy) => {
    // Your existing reducer logic...
    return acc;
  }, {} as Record<string, Map<string, { name: string; count: number; id: string }>>);

  const handleDelete = async (allergyId: string) => {
    if (onDeleteAllergy) {
      await onDeleteAllergy(allergyId);
    }
  };

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
                {Array.from(allergyMap.values()).map((allergy) => (
                  <li
                    key={allergy.id}
                    className="text-sm flex justify-between items-center"
                  >
                    <span className="capitalize">{allergy.name}</span>
                    <div className="flex items-center">
                      <span className="text-gray-500 text-xs mr-2">
                        ({allergy.count})
                      </span>
                      {onDeleteAllergy && (
                        <button
                          onClick={() => handleDelete(allergy.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete allergy"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
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
