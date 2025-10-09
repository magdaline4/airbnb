// DatePicker.jsx - REPLACE YOUR CURRENT ONE WITH THIS
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import '../BookingCalendar/DatePicker.scss';

const DatePicker = ({ checkIn, checkOut, onCheckInChange, onCheckOutChange }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
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
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getNights = () => {
    if (!checkIn || !checkOut) return 1;
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
      onCheckInChange(date);
      // Auto set checkout to next day if it's before or same as new checkin
      if (!checkOut || date >= checkOut) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        onCheckOutChange(nextDay);
      }
      setSelectingCheckIn(false);
    } else {
      if (date > checkIn) {
        onCheckOutChange(date);
        setIsCalendarOpen(false);
        setSelectingCheckIn(true);
      } else {
        onCheckInChange(date);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        onCheckOutChange(nextDay);
      }
    }
  };

  const isInRange = (date) => {
    if (!date || !checkIn || !checkOut) return false;
    return date > checkIn && date < checkOut;
  };

  const isSelected = (date) => {
    if (!date || !checkIn || !checkOut) return false;
    return date.getTime() === checkIn.getTime() || date.getTime() === checkOut.getTime();
  };

  const isCheckIn = (date) => {
    if (!date || !checkIn) return false;
    return date.getTime() === checkIn.getTime();
  };

  const isCheckOut = (date) => {
    if (!date || !checkOut) return false;
    return date.getTime() === checkOut.getTime();
  };

  const clearCheckIn = (e) => {
    e.stopPropagation();
    onCheckInChange(today);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    onCheckOutChange(tomorrow);
  };

  const clearCheckOut = (e) => {
    e.stopPropagation();
    if (checkIn) {
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      onCheckOutChange(nextDay);
    }
  };

  const clearDates = () => {
    onCheckInChange(today);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    onCheckOutChange(tomorrow);
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
                type="button"
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
      <div className="date-inputs-wrapper" ref={calendarRef}>
        <div className="date-inputs-row">
          <div 
            className={`date-input-box ${selectingCheckIn && isCalendarOpen ? 'active' : ''}`}
            onClick={openCheckIn}
          >
            <label>CHECK-IN</label>
            <div className="date-value">
              {formatDate(checkIn)}
              <button type="button" className="clear-btn" onClick={clearCheckIn}>
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
              <button type="button" className="clear-btn" onClick={clearCheckOut}>
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {isCalendarOpen && (
          <div className="calendar-dropdown">
            {/* Nights and Date Display inside calendar */}
            <div className="calendar-header-info">
              <div className="nights-display">
                <span className="nights-number">{getNights()}</span> night{getNights() !== 1 ? 's' : ''}
              </div>
              <div className="date-display">
                {checkIn?.getDate()} {monthNames[checkIn?.getMonth()].slice(0, 3)} {checkIn?.getFullYear()} - {checkOut?.getDate()} {monthNames[checkOut?.getMonth()].slice(0, 3)} {checkOut?.getFullYear()}
              </div>
            </div>

            <div className="calendar-navigation">
              <button 
                type="button"
                onClick={prevMonth} 
                disabled={isPrevDisabled}
                className="nav-btn"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                type="button"
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
              <button type="button" className="clear-dates-btn" onClick={clearDates}>
                Clear dates
              </button>
              <button type="button" className="close-btn" onClick={closeCalendar}>
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