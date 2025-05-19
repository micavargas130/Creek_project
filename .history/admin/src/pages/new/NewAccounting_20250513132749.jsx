import "./newAccounting.scss";
import React from 'react'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import axiosInstance from "../../axios/axiosInstance.js"
import {Navigate} from "react-router-dom"

const New = ({ inputs, title }) => {
  const [amount, setAmount] = useState("");
  const [type,setType] = useState('');
  const [comment, setComment] = useState('');
  const[redirect,setRedirect] = useState(false);
  
  const typeOptions = [
    { value: 'Ingreso', label: 'Ingreso' },
    { value: 'Egreso', label: 'Egreso' },
   ]
  
   async function newAccounting(ev) {
    ev.preventDefault();
  
    try {
      const currentDate = new Date();
  
      // Formatear fecha como "dd-mm-yyyy hh:mm:ss"
      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;
  
      await axiosInstance.post("/accounting/createAccounting", {
        amount,
        totalAmount: amount,
        type,
        remainingAmount: 0,
        status: "pagada",
        date: formattedDate, // Usamos la fecha formateada
        comment,
      });
  
      alert("Registro exitoso");
      setRedirect(true);
    } catch (err) {
      alert("Ups! algo salió mal");
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
          <h1>Añadir nuevo Ingreso/Egreso</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <form onSubmit={newAccounting}>
            <div className="mt-4 grow flex items-center justify-around">
             <div className ="mb-64">
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