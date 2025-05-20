import { useState } from "react";
import {Link, Navigate} from "react-router-dom"
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function LoginPage(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar visibilidad

  
  async function loginSubmit(ev){
    ev.preventDefault();
    try{
    const {data} = await axios.post('/login', {email,password});
    setUser(data);
    alert('Login exitoso');
    setRedirect(true);
    }
    catch (err){
      if(err.response.status == 400){
      alert('Email o contraseña incorrecto');}
      if(err.response.status == 404){
        alert('Email no registrado');}
    }
  }
  
  if(redirect){
    return <Navigate to={'/'} />
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className ="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={loginSubmit}>
            <input type="email" placeholder={'your@email.com'} value={email} onChange = {ev => setEmail(ev.target.value)}/>
            <input type="password"  id="Password" placeholder="password" value={password} onChange = {ev => setPassword(ev.target.value)}/>
            <button className="primary">Login</button>
            <div className="text-center py-2 text-gray-500">
              Crea una cuenta <Link className="underline text" to={'/register'}>Register</Link>
            </div>
        </form>
    </div>
  </div>
  );
}