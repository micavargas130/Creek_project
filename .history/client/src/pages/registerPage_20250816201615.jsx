import { Link, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function RegisterPage(){
  const location = useLocation();
  const googleEmail = location.state?.email || "";

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
      await axios.post('/register', {
        first_name,
        last_name,
        email,
        password: googleEmail ? undefined : password, // 🔹 si viene de google no enviamos pass
        phone,
        dni,
        birthday,
        ocupation
      });
      alert('Registro exitoso');
      setRedirect(true);
    } catch (err){
      alert ('Email ya registrado');
    }
  }

  if(redirect){
    return <Navigate to={'/login'}/>
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Completar Perfil</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input type="text" placeholder="First Name" value={first_name} onChange={ev => setFirstName(ev.target.value)}/> 
          <input type="text" placeholder="Last Name" value={last_name} onChange={ev => setLastName(ev.target.value)}/> 
          <input type="email" value={email} disabled={!!googleEmail} onChange={ev => setEmail(ev.target.value)}/>
          
          {!googleEmail && (
            <input type="text" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)}/>
          )}
          
          <input type="number" placeholder="Phone" value={phone} onChange={ev => setPhone(ev.target.value)}/>
          <input type="number" placeholder="DNI" value={dni} onChange={ev => setDni(ev.target.value)}/>
          <input type="date" value={birthday} onChange={ev => setBirthday(ev.target.value)}/>
          <input type="text" placeholder="Ocupation" value={ocupation} onChange={ev => setOcupation(ev.target.value)}/>
          
          <button className="primary">Guardar</button>
          <div className="text-center py-2 text-gray-500">
            Ya tienes cuenta? <Link className="underline text" to={'/login'}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
