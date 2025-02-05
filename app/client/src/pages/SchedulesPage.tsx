import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, startOfWeek } from 'date-fns';

const SchedulesPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date()));
  const [weeklyMenu, setWeeklyMenu] = useState([
    { day: 'Monday', dishes: [''] },
    { day: 'Tuesday', dishes: [''] },
    { day: 'Wednesday', dishes: [''] },
    { day: 'Thursday', dishes: [''] },
    { day: 'Friday', dishes: [''] },
    { day: 'Saturday', dishes: [''] },
    { day: 'Sunday', dishes: [''] },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      startDate,
      endDate: addDays(startDate, 6),
      weeklyMenu
    };
  
    console.log("Request Payload:", payload);
    
    try {
      const response = await fetch('http://localhost:3000/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to create menu');
      }

      // Handle success
      alert('Menu created successfully');
    } catch (error) {
      console.error('Error creating menu:', error);
      alert('Failed to create menu');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Schedule Weekly Menu</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Select Week Starting From:</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => date && setStartDate(date)}
            minDate={new Date()}
            className="border p-2 rounded"
          />
        </div>

        {weeklyMenu.map((day, index) => (
          <div key={day.day} className="border p-4 rounded">
            <h3 className="font-bold mb-2">{day.day}</h3>
            <div className="space-y-2">
              {day.dishes.map((dish, dishIndex) => (
                <input
                  key={dishIndex}
                  type="text"
                  value={dish}
                  onChange={(e) => {
                    const newMenu = [...weeklyMenu];
                    newMenu[index].dishes[dishIndex] = e.target.value;
                    setWeeklyMenu(newMenu);
                  }}
                  className="border p-2 w-full rounded"
                  placeholder="Enter dish name"
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  const newMenu = [...weeklyMenu];
                  newMenu[index].dishes.push('');
                  setWeeklyMenu(newMenu);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Dish
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded"
        >
          Save Weekly Menu
        </button>
      </form>
    </div>
  );
};

export default SchedulesPage;