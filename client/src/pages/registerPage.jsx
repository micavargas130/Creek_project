import {Link, Navigate} from "react-router-dom"
import { useState } from "react";
import axios from "axios";

export default function RegisterPage(){
    const [first_name,setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dni, setDni] = useState('');
    const [birthday, setBirthday] = useState('');
    const [ocupation, setOcupation] = useState('');
    const[redirect,setRedirect] = useState(false);

    async function registerUser(ev){
       ev.preventDefault();
       try {
       await axios.post('/register', {
            first_name,
            last_name,
            email,
            password,
            dni,
            birthday,
            ocupation

        });
        alert('Registro exitoso');
        setRedirect(true);

         } catch (err){
             alert ('Fallo en el registro de nuevo usuario');
        }
    }

    if(redirect){
      return <Navigate to={'/'}/>
    }

    return (
    <div className="mt-4 grow flex items-center justify-around">
    <div className ="mb-64">
      <h1 className="text-4xl text-center mb-4">Register</h1>
      <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input type="text" placeholder="First Name" value={first_name} onChange={ev => setFirstName(ev.target.value)}/> 
          <input type="text" placeholder="Last Name" value={last_name} onChange={ev => setLastName(ev.target.value)}/> 
          <input type="email" placeholder={'your@email.com'} value={email} onChange={ev => setEmail(ev.target.value)}/>
          <input type="password" placeholder="password" value={password}onChange={ev => setPassword(ev.target.value)}/>
          <input type="number"  placeholder="DNI" value={dni} onChange={ev => setDni(ev.target.value)}/>
          <input type="date"  value={birthday} onChange={ev => setBirthday(ev.target.value)}/>
          <input type="text" placeholder="Ocupation" value={ocupation} onChange={ev => setOcupation(ev.target.value)}/>
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Ya tienes cuenta? <Link className="underline text" to={'/login'}>Login</Link>
          </div>
      </form>
  </div>
</div>
);

}
