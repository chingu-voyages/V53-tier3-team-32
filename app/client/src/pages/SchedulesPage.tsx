import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, startOfWeek, isBefore, isAfter, isSameDay } from "date-fns";

const SchedulesPage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [existingMenus, setExistingMenus] = useState<
    { startDate: Date; endDate: Date }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [weeklyMenu, setWeeklyMenu] = useState([
    { day: "Sunday", dishes: ["", "", ""] },
    { day: "Monday", dishes: ["", "", ""] },
    { day: "Tuesday", dishes: ["", "", ""] },
    { day: "Wednesday", dishes: ["", "", ""] },
    { day: "Thursday", dishes: ["", "", ""] },
    { day: "Friday", dishes: ["", "", ""] },
    { day: "Saturday", dishes: ["", "", ""] },
  ]);

  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Remove the token query parameter from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch existing menus when component mounts
  useEffect(() => {
    const fetchExistingMenus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

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
          const menus = data.menus.map((menu: any) => ({
            startDate: new Date(menu.startDate),
            endDate: new Date(menu.endDate),
          }));
          setExistingMenus(menus);

          // Find the next available week
          const today = new Date();
          let nextAvailableStart = startOfWeek(today, { weekStartsOn: 0 }); // 0 = Sunday

          while (isWeekTaken(nextAvailableStart)) {
            nextAvailableStart = addDays(nextAvailableStart, 7);
          }

          setStartDate(nextAvailableStart);
        }
      } catch (error) {
        console.error("Error fetching existing menus:", error);
      }
    };

    fetchExistingMenus();
  }, []);

  const isWeekTaken = (date: Date): boolean => {
    const weekEnd = addDays(date, 6);
    return existingMenus.some(
      (menu) =>
        (isSameDay(date, menu.startDate) || isAfter(date, menu.startDate)) &&
        (isSameDay(date, menu.endDate) || isBefore(date, menu.endDate))
    );
  };

  const filterAvailableDates = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (isBefore(date, today)) {
      return false;
    }

    // Disable dates that fall within existing menu weeks
    if (isWeekTaken(startOfWeek(date, { weekStartsOn: 0 }))) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to create a menu");
      navigate("/signin");
      return;
    }

    if (!startDate) {
      setError("Please select a start date");
      return;
    }

    const payload = {
      startDate,
      endDate: addDays(startDate, 6),
      weeklyMenu,
    };

    try {
      const response = await fetch(
        "https://menu-scheduler-backend.onrender.com/api/menu",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

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
      navigate("/");
    } catch (error) {
      console.error("Error creating menu:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create menu"
      );
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <h1 className="text-2xl font-bold text-center">Schedule Weekly Menu</h1>
      </div>
      <div className="h-[calc(100vh-64px)] overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 lg:max-w-3xl lg:mx-auto"
          >
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Week Starting From:
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => date && setStartDate(date)}
                filterDate={filterAvailableDates}
                minDate={new Date()}
                className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-auto"
                placeholderText="Select a start date"
                dateFormat="MMMM d, yyyy"
                showDisabledMonthNavigation
              />
            </div>

            <div className="space-y-4">
              {weeklyMenu.map((day, dayIndex) => (
                <div key={day.day} className="bg-white rounded-lg shadow-md">
                  <div className="px-4 py-3 bg-gray-50 border-b">
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
                            newMenu[dayIndex].dishes[mealIndex] =
                              e.target.value;
                            setWeeklyMenu(newMenu);
                          }}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder={`Enter ${mealType.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save Weekly Menu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SchedulesPage;
