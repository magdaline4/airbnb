// DatePicker.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './DatePicker.scss';

const DatePicker = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getNights = () => {
    const diff = checkOut - checkIn;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (newMonth >= minMonth) {
      setCurrentMonth(newMonth);
    }
  };

  const handleDateClick = (date) => {
    if (!date || date < today) return;
    
    if (selectingCheckIn) {
      setCheckIn(date);
      const newCheckOut = new Date(date);
      newCheckOut.setDate(newCheckOut.getDate() + 1);
      setCheckOut(newCheckOut);
      setSelectingCheckIn(false);
    } else {
      if (date > checkIn) {
        setCheckOut(date);
        setIsCalendarOpen(false);
        setSelectingCheckIn(true);
      } else {
        setCheckIn(date);
        const newCheckOut = new Date(date);
        newCheckOut.setDate(newCheckOut.getDate() + 1);
        setCheckOut(newCheckOut);
      }
    }
  };

  const isInRange = (date) => {
    return date && date > checkIn && date < checkOut;
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.getTime() === checkIn.getTime() || date.getTime() === checkOut.getTime();
  };

  const isCheckIn = (date) => {
    return date && date.getTime() === checkIn.getTime();
  };

  const isCheckOut = (date) => {
    return date && date.getTime() === checkOut.getTime();
  };

  const clearCheckIn = (e) => {
    e.stopPropagation();
    setCheckIn(today);
    setCheckOut(tomorrow);
  };

  const clearCheckOut = (e) => {
    e.stopPropagation();
    const newCheckOut = new Date(checkIn);
    newCheckOut.setDate(newCheckOut.getDate() + 1);
    setCheckOut(newCheckOut);
  };

  const clearDates = () => {
    setCheckIn(today);
    setCheckOut(tomorrow);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
    setSelectingCheckIn(true);
  };

  const openCheckIn = () => {
    setIsCalendarOpen(true);
    setSelectingCheckIn(true);
  };

  const openCheckOut = () => {
    setIsCalendarOpen(true);
    setSelectingCheckIn(false);
  };

  const renderCalendar = (monthOffset = 0) => {
    const displayMonth = new Date(
      currentMonth.getFullYear(), 
      currentMonth.getMonth() + monthOffset, 
      1
    );
    const days = getDaysInMonth(displayMonth);
    
    return (
      <div className="calendar-month">
        <div className="calendar-header">
          <h3>
            {monthNames[displayMonth.getMonth()]} {displayMonth.getFullYear()}
          </h3>
        </div>
        <div className="calendar-grid">
          {dayNames.map((day, i) => (
            <div key={i} className="day-name">{day}</div>
          ))}
          {days.map((date, i) => {
            const isPast = date && date < today;
            const selected = isSelected(date);
            const inRange = isInRange(date);
            const isCI = isCheckIn(date);
            const isCO = isCheckOut(date);
            
            return (
              <button
                key={i}
                className={`
                  calendar-day 
                  ${!date ? 'empty' : ''} 
                  ${isPast ? 'past' : ''} 
                  ${selected ? 'selected' : ''} 
                  ${inRange ? 'in-range' : ''} 
                  ${isCI ? 'check-in' : ''} 
                  ${isCO ? 'check-out' : ''}
                `}
                onClick={() => handleDateClick(date)}
                disabled={!date || isPast}
              >
                {date ? date.getDate() : ''}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const isPrevDisabled = currentMonth <= new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="date-picker-container">
      <div className="booking-header">
        <div className="nights-display">
          <span className="nights-number">{getNights()}</span> night{getNights() !== 1 ? 's' : ''}
        </div>
        <div className="date-display">
          {checkIn.getDate()} {monthNames[checkIn.getMonth()].slice(0, 3)} {checkIn.getFullYear()} - {checkOut.getDate()} {monthNames[checkOut.getMonth()].slice(0, 3)} {checkOut.getFullYear()}
        </div>
      </div>

      <div className="date-inputs-wrapper" ref={calendarRef}>
        <div className="date-inputs-row">
          <div 
            className={`date-input-box ${selectingCheckIn && isCalendarOpen ? 'active' : ''}`}
            onClick={openCheckIn}
          >
            <label>CHECK-IN</label>
            <div className="date-value">
              {formatDate(checkIn)}
              <button className="clear-btn" onClick={clearCheckIn}>
                <X size={16} />
              </button>
            </div>
          </div>

          <div 
            className={`date-input-box ${!selectingCheckIn && isCalendarOpen ? 'active' : ''}`}
            onClick={openCheckOut}
          >
            <label>CHECKOUT</label>
            <div className="date-value">
              {formatDate(checkOut)}
              <button className="clear-btn" onClick={clearCheckOut}>
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {isCalendarOpen && (
          <div className="calendar-dropdown">
            <div className="calendar-navigation">
              <button 
                onClick={prevMonth} 
                disabled={isPrevDisabled}
                className="nav-btn"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextMonth}
                className="nav-btn"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="calendars-container">
              {renderCalendar(0)}
              {renderCalendar(1)}
            </div>

            <div className="calendar-footer">
              <button className="clear-dates-btn" onClick={clearDates}>
                Clear dates
              </button>
              <button className="close-btn" onClick={closeCalendar}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;