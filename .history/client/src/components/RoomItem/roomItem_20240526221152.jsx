/* eslint-disable react/prop-types */





  

  
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