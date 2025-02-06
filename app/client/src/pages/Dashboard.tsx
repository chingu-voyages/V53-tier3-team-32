import React, { useState, useEffect } from "react";
import { Calendar, Download } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";

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
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchCurrentMenu();
  }, []);

  const fetchCurrentMenu = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/menu?date=" + new Date().toISOString(),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch menu");
      }

      const responseData = await response.json();
      if (responseData.success && responseData.data) {
        setMenu(responseData.data);
      } else {
        setError(responseData.message || "No menu data available");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error fetching menu");
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date();
      const startDate = startOfWeek(today);
      const endDate = addDays(startDate, 6);

      const requestBody = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const response = await fetch("http://localhost:3000/api/menu/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestBody),
      });

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
      const response = await fetch("http://localhost:3000/api/menu/export", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Weekly Menu Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={handleGenerateClick}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {loading ? "Generating..." : "Generate New Menu"}
          </button>
          <button
            onClick={exportToPDF}
            disabled={!menu || loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black opacity-50"></div>
          {/* Modal */}
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      {menu ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {menu.weeklyMenu.map((day) => (
            <div
              key={day.day}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold">{day.day}</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Breakfast
                  </h3>
                  <p className="mt-1">{day.dishes[0] || "Day Off"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Lunch</h3>
                  <p className="mt-1">{day.dishes[1] || "Day Off"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Dinner
                  </h3>
                  <p className="mt-1">{day.dishes[2] || "Day Off"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No menu available. Generate a new menu to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
