/* eslint-disable react/prop-types */

import axios from "axios";

const RoomItem = ({ item, onDelete }) => {

  const handleCancelClick = async () => {
    try {
      // Send a DELETE request to your server to delete the booking by ID
      await axios.delete(`/bookings/${item._id}`);
     // alert("Cancelation Successfull")
     
      
      // Call the onDelete function to remove the booking from the UI
      //onDelete(item._id);
      window.location.reload();
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