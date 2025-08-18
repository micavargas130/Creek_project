import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./login.scss";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState(null);

  const { loading, login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);

      if (credentials.password === "0camping") {
        navigate("/change-password", { state: { email: credentials.email } });
      } else {
        navigate("/");
      }

      setLocalError(null);
    } catch (err) {
      setLocalError("Email o contraseña incorrectos");
      console.error("Error logging in:", err);
    }
  };

  return (
    <div className="login">
      <div className="login-card">
       <img src="/logoCreek.png" alt="Creek Logo" className="login-logo" />
        <h2 className="login-title">Bienvenido a Creek</h2>
        <div className="lContainer">
          <input
            type="text"
            placeholder="Correo electrónico"
            id="email"
            onChange={handleChange}
            className="lInput"
          />
          <input
            type="password"
            placeholder="Contraseña"
            id="password"
            onChange={handleChange}
            className="lInput"
          />
          <button onClick={handleClick} className="lButton" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          {localError && <span className="error-text">{localError}</span>}
        </div>
      </div>
    </div>
  );
};

export default Login;
