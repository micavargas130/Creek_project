/* eslint-disable react/prop-types */

import axios from "axios";
import { differenceInCalendarDays } from "date-fns";



const RoomItem = ({ item, updateBookingList }) => {

  console.log("item", item);

  const response = await axios.get(`http://localhost:3000/lodges/${");
        const { occupiedPositions } = response.data;
        setOccupiedPositions(occupiedPositions);

        const lodgesResponse = await axios.get("http://localhost:3000/lodges");
        setLodgesInfo(lodgesResponse.data);

        //Trae el precio de hospedar adulto y niño
        const priceResponse = await axios.get("http://localhost:3000/prices/66a82bc2ac1709160e479670");
        setPrice(priceResponse.data);
      } catch (error) 

  
  const getDatesInRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];
  
    // Agregar la fecha de inicio a la lista
    dates.push(new Date(startDate)); // Clonar la fecha
  
    // Calcular las fechas intermedias
    while (startDate < endDate) {
      const newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + 1);
      console.log(newDate);
      dates.push(newDate); // Agregar una copia de la fecha
      startDate.setDate(startDate.getDate() + 1);
      console.log(dates);
    }
  
    // Aplicar el reemplazo a cada elemento del array
    const datesWithReplacement = dates.map((date) => {
      return date.toISOString().replace('T00:00:00.000Z', 'T03:00:00.000Z');
    });
  
    return datesWithReplacement;
  };


  //BOTON DE CANCELAR
  const handleCancelClick = async () => {

    const today = new Date();
    const checkInDate = new Date(item.checkIn);

    const daysDifference = differenceInCalendarDays(checkInDate, today);

    if (daysDifference <= 1) {
      alert("No puede cancelar la reserva con menos de un día de antelación.");
      return;
    }


    try {
      await axios.delete(`/bookings/${item._id}`);
      const datesToDelete = getDatesInRange(item.checkIn, item.checkOut);
      await axios.put(`/lodges/delavailability/${item.place}`, {
        id: item.place,
        dates: datesToDelete
      }); 

      alert("Reserva cancelada exitosamente")

      // Actualizar el estado en el componente padre para eliminar la reserva
      updateBookingList(item._id);
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };
  



  

  
  return (
    <div className="searchItem">
      <div className="siDesc">
        <h1 className="siTitle">{item.placeName}</h1>
        <span className="siSubtitle">
          Studio Apartment with Air conditioning
        </span>
        <span className="siFeatures">Check-in: {item.checkIn}</span>
        <span className="siFeatures">Check-out: {item.checkOut}</span>
        <span className="siCancelOp">Free cancellation </span>
      </div>
      <div className="siDetails">
        <div className="siDetailTexts">
          <span className="siPrice">$ {item.totalAmount}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button  className="siCheckButton" onClick={handleCancelClick}>Cancel</button>
         
        </div>
      </div>
    </div>
  );
};

export default RoomItem;