import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = ({ lodgeId, onDateSelect }) => {
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false); // Estado para alternar entre checkIn y checkOut
  const [checkInDate, setCheckInDate] = useState(null); // Fecha seleccionada para checkIn

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

    // Manejar clic en fecha
  const handleDateSelect = (dateInfo) => {
    const selectedDate = dateInfo.dateStr; // Fecha seleccionada
    if (!isSelectingCheckOut) {
      // Seleccionar checkIn
      setCheckInDate(selectedDate);
      setIsSelectingCheckOut(true);
    } else {
      // Seleccionar checkOut
      onDateSelect(checkInDate, selectedDate); // Notificar al componente padre
      setCheckInDate(null); // Reiniciar selección
      setIsSelectingCheckOut(false);
    }
  };
  
  
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]} // Agregar el plugin de interacción
      initialView="dayGridMonth"
      events={occupiedDates} // Pasar fechas ocupadas como eventos
      dateClick={handleDateSelect} // Manejar clic en fechas
      selectable={true} // Permitir selección
      selectOverlap={false} // No permitir selección en fechas ocupadas
    />
  );
};

export default Calendar;
