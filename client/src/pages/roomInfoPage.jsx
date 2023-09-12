/* eslint-disable react-hooks/rules-of-hooks */
import "./roomInfoPage.css";
import {useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import useFetch from "../hooks/useFetch.js";
import { useLocation } from "react-router-dom";



export default function roomInfoPage(){

  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [lodge,setLodge] = useState(null);
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const {data, loading, error} = useFetch(`/lodges/${id}`)




  

 
  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };


  return (
    <div>
      <div className="lodgeContainer">
        {open && (
          <div className="slider">
            <div className="sliderWrapper">
              <img src={data.photos[slideNumber].src} alt="" className="sliderImg" />
            </div>
          </div>
        )}
        <div className="lodgeWrapper">
          <h1 className="lodgeTitle">{data.name}</h1>
          <div className="lodgeImages">
            {data.photos?.map((photo, i) => (
              <div className="lodgeImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo}
                  alt=""
                  className="lodgeImg"
                />
              </div>
            ))}
          </div>
          <div className="lodgeDetails">
            <div className="lodgeDetailsTexts">
              <h1 className="lodgeMinititle">Details</h1>
              <p className="lodgeDesc">
                {data.description}
              </p>
            </div>
            <div className="lodgeDetailsPrice">
              
                <b>Price: {data.price}</b> 
             
              <button>Reserve or Book Now!</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
