import "./new.scss";
import React from 'react'
import Select from 'react-select'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import {Link, Navigate} from "react-router-dom"
const New = ({ inputs, title }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name,setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [job, setJob] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [email, setEmail] = useState('');
  const [email, setEmail] = useState('');
  const [email, setEmail] = useState('');
  const[redirect,setRedirect] = useState(false);
  const options = [
    { value: 'Ingreso', label: 'Ingreso' },
    { value: 'Egreso', label: 'Egreso' },
   
  ]
  

  async function newAccounting(ev){
    ev.preventDefault();
  
    try {
      
      // Ahora imagePath contiene la ruta de la imagen en el servidor
      // Agrega imagePath a tu objeto de datos antes de enviarlo
  
      await axios.post("http://localhost:3000/accounting", {
        amount,
        type,
        date,
        user,
        cabain,
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
          Nombre <Select options={options} />
          amount <input type="number" placeholder="Monto" value={amount} onChange={ev => setAmount(ev.target.value)}/> 
      
          </div>

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