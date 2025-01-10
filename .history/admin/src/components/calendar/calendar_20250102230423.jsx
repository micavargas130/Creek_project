import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = ({ lodgeId, onDateSelect }) => {
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
  const [highlightedDates, setHighlightedDates] = useState([]);

  useEffect(() => {
    // Obtener las fechas ocupadas desde el backend
    fetch(`http://localhost:3000/lodges/occupied-dates/${lodgeId}`)
      .then((res) => res.json())
      .then((data) => {
        const events = data.occupiedDates.map((date) => ({
          title: 'Ocupado',
          start: date,
          allDay: true,
        }));
        setOccupiedDates(events);
      })
      .catch((error) => {
        console.error('Error al obtener las fechas ocupadas:', error);
      });
  }, [lodgeId]);

  const handleDateClick = (info) => {
    const selectedDate = info.dateStr;

    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      // Si no hay `checkIn` o si ambos están seleccionados, reiniciar selección
      setSelectedDates({ checkIn: selectedDate, checkOut: null });
      setHighlightedDates([]);
    } else if (selectedDates.checkIn && !selectedDates.checkOut) {
      // Si ya hay un `checkIn`, establecer `checkOut`
      if (new Date(selectedDate) < new Date(selectedDates.checkIn)) {
        alert('La fecha de salida debe ser posterior a la de entrada.');
        return;
      }

      const range = getDateRange(selectedDates.checkIn, selectedDate);
      setSelectedDates({ ...selectedDates, checkOut: selectedDate });
      setHighlightedDates(range);
      onDateSelect(selectedDates.checkIn, selectedDate); // Notificar al padre
    }
  };

  const getDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const range = [];

    while (startDate <= endDate) {
      range.push(new Date(startDate).toISOString().split('T')[0]);
      startDate.setDate(startDate.getDate() + 1);
    }

    return range;
  };

  const events = [
    ...occupiedDates,
    ...highlightedDates.map((date) => ({
      title: 'Seleccionado',
      start: date,
      allDay: true,
      backgroundColor: '#90caf9', // Color de las fechas seleccionadas
      borderColor: '#42a5f5',
    })),
  ];

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={handleDateClick}
      selectable={true}
    />
  );
};

export default Calendar;
