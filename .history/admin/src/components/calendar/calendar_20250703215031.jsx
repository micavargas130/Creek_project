import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axiosInstance from "../../axios/axiosInstance";

const Calendar = ({ lodgeId, onDateSelect, checkIn, checkOut, readOnly = false }) => {
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
  const [highlightedDates, setHighlightedDates] = useState([]);

  useEffect(() => {
  axiosInstance.get(`/lodges/occupied-dates/${lodgeId}`)
    .then((res) => {
      const events = res.data.occupiedDates.map((date) => ({
        title: 'Ocupado',
        start: date,
        allDay: true,
        backgroundColor: '#e57373',
        borderColor: '#c62828',
      }));
      setOccupiedDates(events);
    })
    .catch((error) => {
      console.error('Error al obtener las fechas ocupadas:', error);
    });
}, [lodgeId]);

useEffect(() => {
  if (checkIn && checkOut) {
    const range = getDateRange(checkIn, checkOut);
    setSelectedDates({ checkIn, checkOut });
    setHighlightedDates(range);
  } else {
    setSelectedDates({ checkIn: null, checkOut: null });
    setHighlightedDates([]);
  }
}, [checkIn, checkOut]);


  const handleDateClick = (info) => {
    if (readOnly) return; // 🔹 Bloquear selección si readOnly es true

    const selectedDate = info.dateStr;
    const today = new Date().toISOString().split('T')[0];

    if (selectedDate < today) {
      alert('No puedes seleccionar una fecha pasada.');
      return;
    }

    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      setSelectedDates({ checkIn: selectedDate, checkOut: null });
      setHighlightedDates([]);
    } else if (selectedDates.checkIn && !selectedDates.checkOut) {
      if (new Date(selectedDate) < new Date(selectedDates.checkIn)) {
        alert('La fecha de salida debe ser posterior a la de entrada.');
        return;
      }

      const range = getDateRange(selectedDates.checkIn, selectedDate);
      setSelectedDates({ ...selectedDates, checkOut: selectedDate });
      setHighlightedDates(range);
      onDateSelect(selectedDates.checkIn, selectedDate);
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
      backgroundColor: '#90caf9', // Azul para fechas seleccionadas
      borderColor: '#42a5f5',
    })),
  ];

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      selectable={!readOnly} // 🔹 Bloquear selección si readOnly es true
      selectMirror={true}
      events={events}
      dateClick={handleDateClick}
      dayCellDidMount={(info) => {
        const today = new Date().toISOString().split('T')[0];
        const cellDate = info.date.toISOString().split('T')[0];

        if (cellDate < today) {
          info.el.style.backgroundColor = '#e0e0e0'; // 🔹 Color gris para fechas pasadas
          info.el.style.opacity = '0.6';
        }
      }}
    />
  );
};


export default Calendar;
