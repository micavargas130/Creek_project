import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import bcrypt from "bcryptjs";
import "./login.scss";

const ChangePassword = () => {
  const { user } = useContext(UserContext);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  if (!user) {
    // Si el usuario es null, redirige al login
    navigate("/login");
    return null;
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      // Encripta la nueva contraseña antes de enviarla al backend
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      await axios.put(`http://localhost:3000/user/changePassword/${user.id}`, { password: hashedPassword });
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
