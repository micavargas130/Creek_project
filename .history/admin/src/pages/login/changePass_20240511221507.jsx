import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UserContext } from "../../context/UserContext.jsx";
import bycrypt from "bcryptjs";

const ChangePassword = () => {
  const { ready, user, setUser } = useContext(UserContext);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      // Encripta la nueva contraseña antes de enviarla al backend
      const salt = bycrypt.genSaltSync(10);
      const hashedPassword = bycrypt.hashSync(newPassword, salt);
      await axios.put(`/${user.id}/changePassword`, { newPassword: hashedPassword }); // Modificar la ruta aquí
      // Redirige al usuario a la página de inicio después de cambiar la contraseña
      navigate("/");
    } catch (err) {
      console.error("Error changing password:", err);
      // Manejo de errores
    }
  };

  return (
    <div>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
