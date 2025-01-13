import "./newAccounting.scss";
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
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const[redirect,setRedirect] = useState(false);
  
  const typeOptions = [
    { value: 'Ingreso', label: 'Ingreso' },
    { value: 'Egreso', label: 'Egreso' },
   
  ]


  async function newAccounting(ev){
    ev.preventDefault();
  
    try {
      
    const currentDate = new Date(); // Obtener la fecha y hora actual
    const formattedDate = currentDate.toISOString(); // Formatear la fecha y hora en formato ISO string

    await axios.post("http://localhost:3000/accounting", {
      amount,
      type,
      status,
      date: formattedDate, // Utilizar la fecha y hora actual formateada
      comment,
    });
  
      alert("Registro exitoso");
      setRedirect(true);
    } catch (err) {
      alert("Ups! algo salio mal");
    }
  }

 if(redirect){
   return <Navigate to={'/Accounting'}/>
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
            <form onSubmit={newAccounting}>
            <div className="mt-4 grow flex items-center justify-around">
             <div className ="mb-64">
         <div>
          <nh1>Datos del huesped</nh1></div>
          <div>  Tipo: 
          <select value={type} onChange={(e) => setType(e.target.value)}>
               <option value="">Seleccionar tipo</option>
                {typeOptions.map((option) => (
                                          <option key={option.value} value={option.value}>
                                          {option.label}</option>
                                         ))}
         </select>
          </div>

          
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