import "./new.scss";
import React, { useState } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { Navigate } from "react-router-dom";

const New = ({ inputs, title }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('1234'); // Password fijo
  const [job, setJob] = useState('');
  const [dni, setDni] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [base_salary, setBaseSalary] = useState('');
  const [start_date, setStartDate] = useState('');
  const [redirect, setRedirect] = useState(false);

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
        photo,
        base_salary,
        start_date,
      
      });
  
      alert("Registro exitoso");
      setRedirect(true);
    } catch (err) {
      console.error(err); // Añadir esta línea para ver el error en la consola
      alert("Error al registrar el empleado");
    }
  }

  if (redirect) {
    return <Navigate to="/employees" />;
  }

  const handleDniChange = (ev) => {
    const inputValue = ev.target.value;
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
          <div className="right">
            <form onSubmit={newEmployee}>
              <div>
                <div>Nombre <input type="text" placeholder="Nombre" value={first_name} onChange={ev => setFirstName(ev.target.value)} /></div>
                <div>Apellido <input type="text" placeholder="Apellido" value={last_name} onChange={ev => setLastName(ev.target.value)} /></div>
                <div>DNI <input type="number" placeholder="DNI" value={dni} onChange={handleDniChange} /></div>
                <div>Cumpleaños <input type="date" placeholder="Cumpleaños" value={birthday} onChange={ev => setBirthday(ev.target.value)} /></div>
                <div>Puesto <input type="text" placeholder="Puesto" value={job} onChange={ev => setJob(ev.target.value)} /></div>
                <div>Telefono <input type="number" placeholder="Telefono" value={phone} onChange={ev => setPhone(ev.target.value)} /></div>
                <div>Email <input type="email" placeholder="Email" value={email} onChange={ev => setEmail(ev.target.value)} /></div>
                <div>Salario Base <input type="number" placeholder="Salario Base" value={base_salary} onChange={ev => setBaseSalary(ev.target.value)} /></div>
                <div>Fecha de inicio <input type="date" placeholder="Fecha de inicio" value={start_date} onChange={ev => setStartDate(ev.target.value)} /></div>
                <div>Foto <input type="text" placeholder="Link de la foto" value={photo} onChange={ev => setPhoto(ev.target.value)} /></div>
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
