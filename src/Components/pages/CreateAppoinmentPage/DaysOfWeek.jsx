import React, { useState, useEffect } from "react";

const DaysOfWeek = ({ onDateSelect, day }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [datesInMonth, setDatesInMonth] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const getMonthDates = (month, year, dayName) => {
    const daysArray = [];
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const dayOfWeekMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 0,
    };

    let currentDate = new Date(startDate);
    currentDate.setDate(
      currentDate.getDate() -
        (currentDate.getDay() || 7) +
        dayOfWeekMap[dayName]
    );

    while (currentDate <= endDate) {
      daysArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7);
    }
    return daysArray;
  };

  useEffect(() => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    if (day) {
      setDatesInMonth(getMonthDates(month, year, day));
    }
  }, [currentMonth, day]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect(date.toDateString());
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowLeft":
        setCurrentMonth(
          (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
        );
        break;
      case "ArrowRight":
        setCurrentMonth(
          (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center mb-4 mt-3 md:mt-5">
        <h2 className="text-[14px] md:text-[15px] text-gray-400 font-semibold mx-4">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
      </div>

      <div className="w-full grid grid-cols-3 md:flex md:flex-wrap justify-between">
        <button
          className="p-2 rounded-l-md hover:bg-gray-400"
          onClick={() =>
            setCurrentMonth(
              (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
            )
          }
        >
          &lt;
        </button>
        {datesInMonth.map((date, index) => {
          const isSelected =
            selectedDate && date.toDateString() === selectedDate.toDateString();
          const currentDayIndex = new Date().getDate();

          return (
            <div
              key={index}
              className={`flex flex-col items-center p-4 m-2 rounded-md cursor-pointer ${
                isSelected
                  ? "bg-lightblueButton text-white"
                  : date.getDate() === currentDayIndex
                  ? "border-2 border-blue-500 bg-blue-100 text-gray-700"
                  : "border border-gray-500 bg-white text-gray-700"
              }`}
              onClick={() => handleDateClick(date)}
            >
              <div className="text-[15px] font-bold">{date.getDate()}</div>
              <div className="text-[12px] font-bold">{day}</div>
            </div>
          );
        })}
        <button
          className="p-2 rounded-r-md hover:bg-gray-400"
          onClick={() =>
            setCurrentMonth(
              (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
            )
          }
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default DaysOfWeek;
