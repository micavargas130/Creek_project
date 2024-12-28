import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Calendar = ({ lodgeId }) => {
  const [occupiedDates, setOccupiedDates] = useState([]);

  useEffect(() => {
    // Obtener las fechas ocupadas desde el backend
    fetch(`lodges/occupied-dates/`)
      .then((res) => res.json())
      .then((data) => {
        // Formatear fechas para FullCalendar
        const events = data.occupiedDates.map((date) => ({
          title: 'Ocupado',
          start: date,
          allDay: true,
        }));
        setOccupiedDates(events);
      });
  }, [lodgeId]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={occupiedDates} // Pasar fechas como eventos
    />
  );
};

export default Calendar;
