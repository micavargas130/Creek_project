import { Link, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage(){
  const location = useLocation();
  const googleEmail = location.state?.email || "";
  const userId = location.state?.userId || null;

  const [first_name,setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState(googleEmail);
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dni, setDni] = useState('');
  const [birthday, setBirthday] = useState('');
  const [ocupation, setOcupation] = useState('');
  const [redirect,setRedirect] = useState(false);

  async function registerUser(ev){
    ev.preventDefault();
    try {
      if (userId) {
        //si viene de Google actualizar perfil
        await axios.put(`/completeProfile/${userId}`, {
          first_name,
          last_name,
          phone,
          dni,
          password,
          birthday,
          ocupation
        });
      } else {
        //registro normal
        await axios.post('/register', {
          first_name,
          last_name,
          email,
          password,
          phone,
          dni,
          birthday,
          ocupation
        });
      }
      
      alert('Perfil guardado correctamente');
      setRedirect(true);

    } catch (err){
      alert('Error guardando el perfil');
    }
  }

  if(redirect){
    return <Navigate to={'/login'}/>
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">
          {userId ? "Completar Perfil" : "Register"}
        </h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input type="text" placeholder="Nombre" value={first_name} onChange={ev => setFirstName(ev.target.value)}/> 
          <input type="text" placeholder="Apellido" value={last_name} onChange={ev => setLastName(ev.target.value)}/> 
          <input type="email" value={email} disabled={!!googleEmail} onChange={ev => setEmail(ev.target.value)}/>
          <input type="text" placeholder="Contraseña" value={password} onChange={ev => setPassword(ev.target.value)}/>
          <input type="number" placeholder="Telefono" value={phone} onChange={ev => setPhone(ev.target.value)}/>
          <input type="number" placeholder="DNI" value={dni} onChange={ev => setDni(ev.target.value)}/>
          <input type="date" value={birthday} onChange={ev => setBirthday(ev.target.value)}/>
          <input type="text" placeholder="Ocupacion" value={ocupation} onChange={ev => setOcupation(ev.target.value)}/>
          
          <button className="primary">Guardar</button>
          <div className="text-center py-2 text-gray-500">
            Ya tienes cuenta? <Link className="underline text" to={'/login'}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
