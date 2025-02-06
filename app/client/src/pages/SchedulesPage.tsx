import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, startOfWeek } from "date-fns";

const SchedulesPage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(startOfWeek(new Date()));
  const [error, setError] = useState<string | null>(null);
  const [weeklyMenu, setWeeklyMenu] = useState([
    { day: "Monday", dishes: ["", "", ""] },
    { day: "Tuesday", dishes: ["", "", ""] },
    { day: "Wednesday", dishes: ["", "", ""] },
    { day: "Thursday", dishes: ["", "", ""] },
    { day: "Friday", dishes: ["", "", ""] },
    { day: "Saturday", dishes: ["", "", ""] },
    { day: "Sunday", dishes: ["", "", ""] },
  ]);

  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to create a menu");
      navigate("/signin");
      return;
    }

    const payload = {
      startDate,
      endDate: addDays(startDate, 6),
      weeklyMenu,
    };

    try {
      const response = await fetch("http://localhost:3000/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError("Session expired. Please log in again");
          localStorage.removeItem("token");
          navigate("/signin");
          return;
        }
        throw new Error(data.message || "Failed to create menu");
      }

      alert("Menu created successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating menu:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create menu"
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Schedule Weekly Menu</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Week Starting From:
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => date && setStartDate(date)}
            minDate={new Date()}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {weeklyMenu.map((day, dayIndex) => (
            <div
              key={day.day}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold">{day.day}</h2>
              </div>
              <div className="p-4 space-y-4">
                {mealTypes.map((mealType, mealIndex) => (
                  <div key={mealType}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {mealType}
                    </label>
                    <input
                      type="text"
                      value={day.dishes[mealIndex]}
                      onChange={(e) => {
                        const newMenu = [...weeklyMenu];
                        newMenu[dayIndex].dishes[mealIndex] = e.target.value;
                        setWeeklyMenu(newMenu);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter ${mealType.toLowerCase()} dish`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Save Weekly Menu
        </button>
      </form>
    </div>
  );
};

export default SchedulesPage;
