import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import {Link, Navigate} from "react-router-dom"
const New = ({ inputs, title }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name,setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ocupation, setOcupation] = useState('');
  const[redirect,setRedirect] = useState(false);
  const[checkIn, setCheckIn] = useState("");
  const[checkOut, setCheckOut] = useState("");
  const[numberOfGuests, setNumberOfGuests] = useState("");


  async function newTent(ev){
    ev.preventDefault();
  
    try {
      
      // Ahora imagePath contiene la ruta de la imagen en el servidor
      // Agrega imagePath a tu objeto de datos antes de enviarlo
  
      await axios.post("http://localhost:3000/tents", {
        first_name,
        last_name,
        dni,
        email,
        phone,
        ocupation,
        checkIn,
        checkOut,
        numberOfGuests, // Agrega la ruta de la imagen como cadena
      });
  
      alert("Registro exitoso");
      setRedirect(true);
    } catch (err) {
      alert("Email ya registrado");
    }
  }

 if(redirect){
   return <Navigate to={'/tents'}/>
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
            <form onSubmit={newTent}>
  

        <div className="mt-4 grow flex items-center justify-around">
        <div className ="mb-64">
          <div>
          <nh1>Datos del huesped</nh1></div>
          <div> 
          Nombre <input type="text" placeholder="Nombre" value={first_name} onChange={ev => setFirstName(ev.target.value)}/>
         Apellido <input type="text" placeholder="Apellido" value={last_name} onChange={ev => setLastName(ev.target.value)}/> 
          DNI<input type="text" placeholder="Dni" value={dni} onChange={ev => setDni(ev.target.value)}/> 
         Email <input type="email" placeholder={'Email'} value={email} onChange={ev => setEmail(ev.target.value)}/>
          Telefono<input type="text" placeholder="Telefono" value={phone} onChange={ev => setPhone(ev.target.value)}/>
          Ocupación<input type={'text'} placeholder="Ocupación" value={ocupation} onChange={ev => setOcupation(ev.target.value)}/>
          </div>

          <nh1>Datos de la reserva</nh1>
          <div> 
          Check-In<input type="date" placeholder="check-in" value={checkIn} onChange={ev => setCheckIn(ev.target.value)}/>
          Check-Out<input type={'date'} placeholder="check-out" value={checkOut} onChange={ev => setCheckOut(ev.target.value)}/>
          Cantidad de hospedados<input type={'number'} placeholder="cant huespedes" value={numberOfGuests} onChange={ev => setNumberOfGuests(ev.target.value)}/>
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