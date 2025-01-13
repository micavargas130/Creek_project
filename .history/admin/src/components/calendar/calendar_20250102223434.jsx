import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = ({ lodgeId }) => {
  const Calendar = ({ lodgeId, onDateSelect }) => {
    const [occupiedDates, setOccupiedDates] = useState([]);

  useEffect(() => {
    // Obtener las fechas ocupadas desde el backend
    fetch(`http://localhost:3000/lodges/occupied-dates/${lodgeId}`)
      .then((res) => res.json())
      .then((data) => {
        // Formatear fechas para FullCalendar
        const events = data.occupiedDates.map((date) => ({
          title: 'Ocupado',
          start: date,
          allDay: true,
        }));
        setOccupiedDates(events); // Actualizar el estado con los eventos
  
        console.log(events); // Ver los eventos generados
      })
      .catch((error) => {
        console.error('Error al obtener las fechas ocupadas:', error);
      });
  }, [lodgeId]);
  
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={occupiedDates} // Pasar fechas ocupadas como eventos
    />
  );
};

export default Calendar;
