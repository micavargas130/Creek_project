import axiosInstance from "../../axios/axiosInstance.js"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import "./changePass.scss";

const ChangePassword = () => {
  const { user } = useContext(UserContext);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axiosInstance.put(`/user/changePassword/${user._id}`, {
        password: newPassword,
      });
      alert("Contraseña cambiada exitosamente");
      navigate("/");
    } catch (err) {
      setError("Error al cambiar la contraseña. Inténtalo nuevamente.");
      console.error("Error changing password:", err);
    }
  };

  return (
    <div className="changePassword">
      <h1>Cambiar Contraseña</h1>
      <div className="cpContainer">
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="cpInput"
          />
          <button type="submit" className="cpButton">
            Cambiar
          </button>
        </form>
        {error && <span className="cpError">{error}</span>}
      </div>
    </div>
  );
};

export default ChangePassword;
