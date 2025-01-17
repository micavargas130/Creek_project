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

  const { loading, error, login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
        navigate("/");
      }
  
      // Limpia el error local si el inicio de sesión fue exitoso
      setLocalError(null);
    } catch (err) {
      setLocalError("Invalid credentials or insufficient permissions");
      console.error("Error logging in:", err);
    }
  };
  

  return (
    <div className="login">
      <h1>Creek</h1>
      <div className="lContainer">
        <input
          type="text"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button onClick={handleClick} className="lButton" disabled={loading}>
          Login
        </button>
        {localError && <span>{localError}</span>}
      </div>
    </div>
  );
};

export default Login;
