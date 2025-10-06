import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './Calendar.scss';

const Calendar = ({ onDateSelect }) => {
  const [checkIn, setCheckIn] = useState(new Date(2025, 9, 8));
  const [checkOut, setCheckOut] = useState(new Date(2025, 9, 13));
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(9);
  const [currentYear, setCurrentYear] = useState(2025);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isInRange = (date) => {
    return date > checkIn && date < checkOut;
  };

  const handleDateClick = (day, month, year) => {
    const selectedDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) return;
    
    if (selectingCheckIn) {
      setCheckIn(selectedDate);
      setSelectingCheckIn(false);
      if (selectedDate >= checkOut) {
        setCheckOut(new Date(selectedDate.getTime() + 5 * 24 * 60 * 60 * 1000));
      }
      // Callback for parent component
      if (onDateSelect) {
        onDateSelect({ checkIn: selectedDate, checkOut });
      }
    } else {
      if (selectedDate > checkIn) {
        setCheckOut(selectedDate);
        setSelectingCheckIn(true);
        // Callback for parent component
        if (onDateSelect) {
          onDateSelect({ checkIn, checkOut: selectedDate });
        }
      } else {
        setCheckIn(selectedDate);
        if (onDateSelect) {
          onDateSelect({ checkIn: selectedDate, checkOut });
        }
      }
    }
  };

  const renderCalendar = (monthOffset = 0) => {
    const month = (currentMonth + monthOffset + 12) % 12;
    const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isCheckInDate = isSameDay(date, checkIn);
      const isCheckOutDate = isSameDay(date, checkOut);
      const inRange = isInRange(date);
      const isPast = date < today;

      const classNames = ['calendar-day'];
      if (isPast) classNames.push('past');
      else if (isCheckInDate || isCheckOutDate) classNames.push('selected');
      else if (inRange) classNames.push('in-range');

      days.push(
        <div
          key={day}
          className={classNames.join(' ')}
          onClick={() => handleDateClick(day, month, year)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const clearDates = () => {
    const today = new Date();
    const newCheckIn = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const newCheckOut = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
    setSelectingCheckIn(true);
    if (onDateSelect) {
      onDateSelect({ checkIn: newCheckIn, checkOut: newCheckOut });
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <h1 className="calendar-title">{nights} nights in Kelambakkam</h1>
        <p className="calendar-subtitle">
          {formatDate(checkIn)} - {formatDate(checkOut)}
        </p>

        <div className="calendar-navigation">
          <button onClick={prevMonth} className="nav-button">
            <ChevronLeft size={20} />
          </button>
          <div className="month-headers">
            <h2 className="month-title">{monthNames[currentMonth]} {currentYear}</h2>
            <h2 className="month-title">
              {monthNames[(currentMonth + 1) % 12]} {currentYear + Math.floor((currentMonth + 1) / 12)}
            </h2>
          </div>
          <button onClick={nextMonth} className="nav-button">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="calendars-grid">
          {/* First Month */}
          <div className="month-calendar">
            <div className="day-names">
              {dayNames.map((day, i) => (
                <div key={i} className="day-name">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {renderCalendar(0)}
            </div>
          </div>

          {/* Second Month */}
          <div className="month-calendar">
            <div className="day-names">
              {dayNames.map((day, i) => (
                <div key={i} className="day-name">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {renderCalendar(1)}
            </div>
          </div>
        </div>

        <div className="calendar-footer">
          <button className="clear-button" onClick={clearDates}>
            <CalendarIcon size={16} />
            Clear dates
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;