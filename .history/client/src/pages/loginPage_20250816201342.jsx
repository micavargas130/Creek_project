import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  async function loginSubmit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("/login", { email, password });
      setUser(data);
      setRedirect(true);
    } catch (err) {
      if (err.response?.status === 400) alert("Email o contraseña incorrecto");
      if (err.response?.status === 404) alert("Email no registrado");
    }
  }

  async function handleGoogleLoginSuccess(credentialResponse) {
  try {
    const userInfo = jwtDecode(credentialResponse.credential);

    const { data } = await axios.post("/login/google", {
      email: userInfo.email,
      name: userInfo.name,
      googleId: userInfo.sub,
    });

    if (data.needsProfileCompletion) {
      // Redirigir a RegisterPage pero con email fijo
      navigate("/register", { state: { email: data.email } });
    } else {
      // Login normal
      setUser(data.user);
      setRedirect(true);
    }

  } catch (err) {
    console.error("Error en login con Google:", err);
  }
}


  if (redirect) return <Navigate to="/" />;

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={loginSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            id="Password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Login</button>
        </form>

        {/* Botón de Google */}
        <div className="mt-4 text-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => {
              console.log("Error en Google Login");
            }}
          />
        </div>

        <div className="text-center py-2 text-gray-500">
          Crea una cuenta <Link className="underline text" to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
