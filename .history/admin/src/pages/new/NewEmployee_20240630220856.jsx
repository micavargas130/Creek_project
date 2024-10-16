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
  const [phone, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [base_salary, setBaseSalary] = useState('');
  const [start_date, setStartDate] = useState('');

  const[redirect,setRedirect] = useState(false);

  

  async function newEmployee(ev) {
    ev.preventDefault();
  
    try {
      await axios.post("http://localhost:3000/employees/", {
        first_name,
        last_name,
        birthday,
        job,
        dni,
        phone,
        email,
        password: "1234", // Se incluye el password aquí para crear el User
        photo,
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
   return <Navigate to={'/employees'}/>
 }

 const handleDniChange = (ev) => {
  const inputValue = ev.target.value;
  // Limitar la longitud del valor del DNI a 8 caracteres
  if (inputValue.length <= 8) {
    setDni(inputValue);
  }
};

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
          DNI <input type="number" placeholder="DNI" value={dni} onChange={handleDniChange} />
          Cumpleaños <input type="Date" placeholder="Cumpleaños" value={birthday} onChange={ev => setBirthday(ev.target.value)}/>
          Puesto <input type="text" placeholder="Puesto" value={job} onChange={ev => setJob(ev.target.value)}/>
          Telefono <input type="Number" placeholder="Telefono" value={phone_number} onChange={ev => setPhoneNumber(ev.target.value)}/>
          Email <input type="email" placeholder="Email" value={email} onChange={ev => setEmail(ev.target.value)}/>
          Salario Base <input type="Number" placeholder="Salario Base" value={base_salary} onChange={ev => setBaseSalary(ev.target.value)}/>
          Fecha de inicio <input type="Date" placeholder="Email" value={start_date} onChange={ev => setStartDate(ev.target.value)}/>
          Foto <input type="text" placeholder="Link de la foto" value={photo} onChange={ev => setPhoto(ev.target.value)}/>
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