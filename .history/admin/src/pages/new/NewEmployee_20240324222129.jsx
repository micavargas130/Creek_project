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
  const [password, setPassword] = useState('');
  const [job, setJob] = useState('');
  const [dni, setDni] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [base_salary, setBaseSalary] = useState('');
  const [start_date, setStartDate] = useState('');

  const[redirect,setRedirect] = useState(false);

  async function newEmployee(ev){
    ev.preventDefault();
  
    try {
      
      // Ahora imagePath contiene la ruta de la imagen en el servidor
      // Agrega imagePath a tu objeto de datos antes de enviarlo
  
      await axios.post("http://localhost:3000/employees", {
        first_name,
        last_name,
        birthday,
        password,
        job,
        dni,
        phone_number,
        email,
        base_salary,
        start_date,
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
          <h1>Añadir nuevo empleado</h1>
        </div>
        <div className="bottom">
          <div className="left">
          
          </div>
          <div className="right">
            <form onSubmit={newEmployee}>
  

        <div className="mt-4 grow flex items-center justify-around">
        <div className ="mb-64">
          <div>
          <nh1>Datos del huesped</nh1></div>
          <div> 
          Nombre <input type="text" placeholder="Nombre" value={first_name} onChange={ev => setFirstName(ev.target.value)}/> 
          Apellido <input type="text" placeholder="Apellido" value={last_name} onChange={ev => setLastName(ev.target.value)}/> 
          DNI <input type="Number" placeholder="DNI" value={dni} onChange={ev => setDni(ev.target.value)}/>
          Cumpleaños <input type="Date" placeholder="Cumpleaños" value={birthday} onChange={ev => setBirthday(ev.target.value)}/>
          Puesto <input type="text" placeholder="Puesto" value={job} onChange={ev => setJob(ev.target.value)}/>
          Telefono <input type="Number" placeholder="Telefono" value={phone_number} onChange={ev => setLastName(ev.target.value)}/>
          Apellido <input type="text" placeholder="Apellido" value={last_name} onChange={ev => setLastName(ev.target.value)}/>
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