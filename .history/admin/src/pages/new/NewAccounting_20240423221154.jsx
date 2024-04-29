import "./new.scss";
import React from 'react'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import {Navigate} from "react-router-dom"

const New = ({ inputs, title }) => {
  const [amount, setAmount] = useState("");
  const [type,setType] = useState('');
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const[redirect,setRedirect] = useState(false);
  
  const options = [
    { value: 'Ingreso', label: 'Ingreso' },
    { value: 'Egreso', label: 'Egreso' },
   
  ]
  

  async function newAccounting(ev){
    ev.preventDefault();
  
    try {
      
      await axios.post("http://localhost:3000/accountings", {
        amount,
        type,
        date,
        comment,
      });
  
      alert("Registro exitoso");
      setRedirect(true);
    } catch (err) {
      alert("Email ya registrado");
    }
  }

 if(redirect){
   return <Navigate to={'/accounting'}/>
 }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Añadir una nueva cabaña</h1>
        </div>
        <div className="bottom">
          <div className="left">
          
          </div>
          <div className="right">
            <form onSubmit={newAccounting}>
  

        <div className="mt-4 grow flex items-center justify-around">
        <div className ="mb-64">
          <div>
          <nh1>Datos del huesped</nh1></div>
          <div>  
          Tipo <select value={type} onChange={(e) => setType(e.target.value)}>
               <option value="">Seleccionar tipo</option>
                {options.map((option) => (
                                          <option key={option.value} value={option.value}>
         {option.label}
      </option>
    ))}
  </select> </div>
          Amount <input type="number" placeholder="Monto" value={amount} onChange={ev => setAmount(ev.target.value)}/> 
          Comment <input type="text" placeholder="Comment" value={comment} onChange={ev => setComment(ev.target.value)} />
          <div className="text-center py-2 text-gray-500">
          </div>
  
        </div>
        </div> 
              <button>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;