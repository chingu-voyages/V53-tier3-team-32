import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Download } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { Allergy } from "../models/interface/IAllergy.tsx";
import AllergiesList from "../components/AllergiesList.tsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

interface DayMenu {
  day: string;
  dishes: string[];
}

interface Menu {
  weeklyMenu: DayMenu[];
  startDate: Date;
  endDate: Date;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [availableWeeks, setAvailableWeeks] = useState<
    { startDate: Date; endDate: Date }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Remove the token query parameter from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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

  const fetchAllergies = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await fetch(
        "https://menu-scheduler-backend.onrender.com/api/allergy/allergies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/signin");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch allergies");
      }
      const data = await response.json();
      setAllergies(data.allergies || []);
    } catch (error) {
      console.error("Error fetching allergies:", error);
    }
  }, [navigate]);

  const deleteAllergy = async (allergyId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await fetch(
        `https://menu-scheduler-backend.onrender.com/api/allergy/delete/${allergyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Refresh allergies after deletion
        await fetchAllergies();
      } else {
        const data = await response.json();
        console.error("Error deleting allergy:", data.msg);
      }
    } catch (error) {
      console.error("Error deleting allergy:", error);
    }
  };

  const fetchAvailableWeeks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await fetch(
        "https://menu-scheduler-backend.onrender.com/api/menu/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAvailableWeeks(
          data.menus.map((menu: any) => ({
            startDate: new Date(menu.startDate),
            endDate: new Date(menu.endDate),
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching available weeks:", error);
    }
  }, [navigate]);

  const fetchCurrentMenu = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const formattedDate = selectedDate.toISOString().split("T")[0];

      const response = await fetch(
        `https://menu-scheduler-backend.onrender.com/api/menu?date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log response for debugging
      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/signin");
        return;
      }

      // Set menu to null if no menu is found
      if (responseData.success && responseData.data) {
        setMenu(responseData.data);
        setError(null);
      } else {
        setMenu(null);
        setError(responseData.message || "No menu found for this week");
      }
    } catch (error) {
      setMenu(null);
      setError(error instanceof Error ? error.message : "Error fetching menu");
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate, selectedDate]);

  const generateNewMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const today = new Date();
      const startDate = startOfWeek(today);
      const endDate = addDays(startDate, 6);

      const requestBody = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const response = await fetch(
        "https://menu-scheduler-backend.onrender.com/api/menu/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/signin");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate menu");
      }

      const newMenu = await response.json();
      if (newMenu.success && newMenu.data) {
        setMenu(newMenu.data);
        setError(null);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error generating menu";
      setError(errorMessage);
      console.error("Error generating menu:", error);
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const handleGenerateClick = () => {
    if (menu) {
      setShowConfirmDialog(true);
    } else {
      generateNewMenu();
    }
  };

  const exportToPDF = async () => {
    try {
      setError(null);
      const response = await fetch(
        "https://menu-scheduler-backend.onrender.com/api/menu/export",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export menu");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `weekly-menu-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error exporting menu");
      console.error("Error exporting menu:", error);
    }
  };

  const WeekSelector = () => {
    const filterAvailableDates = (date: Date) => {
      return availableWeeks.some(
        (week) =>
          date >= new Date(week.startDate) && date <= new Date(week.endDate)
      );
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">
          No menu found for this week
        </h3>
        <p className="mb-4">Select another week to view its menu:</p>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => date && setSelectedDate(date)}
          filterDate={filterAvailableDates}
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-auto"
          placeholderText="Select a date"
          dateFormat="MMMM d, yyyy"
        />
      </div>
    );
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAvailableWeeks(),
      fetchCurrentMenu(),
      fetchAllergies(),
    ]).finally(() => {
      setLoading(false);
    });
  }, [fetchAvailableWeeks, fetchCurrentMenu, fetchAllergies]);

  if (loading) {
    // Add timeout to prevent infinite loading
    setTimeout(() => {
      setLoading(false);
    }, 10000); // 10 seconds timeout

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center mb-4 lg:mb-0">
          Weekly Menu Dashboard
        </h1>
        {/* Action Buttons - Only visible on larger screens */}
        <div className="hidden lg:flex space-x-4">
          <button
            onClick={handleGenerateClick}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {loading ? "Generating..." : "Generate New Menu"}
          </button>
          <button
            onClick={exportToPDF}
            disabled={!menu || loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
        {/* Allergies - Full width on mobile, right sidebar on desktop */}
        <div className="w-full lg:hidden mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Allergies</h2>
            <div className="grid grid-cols-2 gap-4">
              {allergies.length > 0 ? (
                <>
                  {/* First column */}
                  <div className="space-y-4">
                    {Object.entries(groupedAllergies)
                      .slice(0, 4)
                      .map(([category, allergyMap]) => (
                        <div key={category} className="border-b pb-2">
                          <h3 className="text-sm font-medium mb-1 capitalize">
                            {category}
                          </h3>
                          <ul className="space-y-1">
                            {Array.from(allergyMap.values()).map(
                              (allergy, i) => (
                                <li
                                  key={i}
                                  className="text-sm flex justify-between"
                                >
                                  <span className="capitalize">
                                    {allergy.name}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    ({allergy.count})
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      ))}
                  </div>

                  {/* Second column */}
                  <div className="space-y-4">
                    {Object.entries(groupedAllergies)
                      .slice(4)
                      .map(([category, allergyMap]) => (
                        <div key={category} className="border-b pb-2">
                          <h3 className="text-sm font-medium mb-1 capitalize">
                            {category}
                          </h3>
                          <ul className="space-y-1">
                            {Array.from(allergyMap.values()).map(
                              (allergy, i) => (
                                <li
                                  key={i}
                                  className="text-sm flex justify-between"
                                >
                                  <span className="capitalize">
                                    {allergy.name}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    ({allergy.count})
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center col-span-2">
                  No allergies found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Menu - Center section */}
        <div className="flex-1 overflow-y-auto pr-6">
          {error === "No menu found for this week" ? (
            <WeekSelector />
          ) : error ? (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              {menu?.weeklyMenu.map((day) => (
                <div
                  key={day.day}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{day.day}</h3>
                  </div>
                  <div className="space-y-3">
                    {["Breakfast", "Lunch", "Dinner"].map((meal, index) => (
                      <div key={meal}>
                        <span className="text-sm font-medium text-gray-500">
                          {meal}:
                        </span>
                        <p className="mt-1">
                          {day.dishes[index] || "No meal scheduled"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Allergies - Right sidebar on desktop only */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-6 max-h-[calc(100vh-140px)] overflow-y-auto">
            {allergies.length > 0 ? (
              <AllergiesList
                allergies={allergies}
                onDeleteAllergy={deleteAllergy}
              />
            ) : (
              <p className="text-gray-500 text-center">No allergies found</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons - Only visible on mobile */}
      <div className="fixed bottom-6 left-6 right-6 grid grid-cols-2 gap-4 lg:hidden">
        <button
          onClick={handleGenerateClick}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {loading ? "..." : "Generate"}
        </button>
        <button
          onClick={exportToPDF}
          disabled={!menu || loading}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg shadow-lg z-50 p-6 w-11/12 max-w-md">
            <h3 className="text-lg font-bold mb-2">Generate New Menu</h3>
            <p className="mb-4">
              This will replace the current menu with a new one. Are you sure
              you want to continue?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={generateNewMenu}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
