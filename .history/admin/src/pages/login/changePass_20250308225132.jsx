import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import RoomItem from "../components/RoomItem/roomItem.jsx";
import { UserContext } from "../context/UserContext";

export default function AccountPage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  let { subpage } = useParams();

  if (subpage === undefined) {
    subpage = "profile";
  }

  useEffect(() => {
    if (user && subpage === "bookings") {
      axios
        .get(`bookings/${user.id}/bookings`)
        .then((response) => {
          const activeBookings = response.data.filter(
            (booking) => booking.status.status === "Activa"
          );
          setBookings(activeBookings);
        })
        .catch((error) => {
          console.error("Error fetching bookings:", error);
        });
    }
  }, [user, subpage]);

  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/login");
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.put(`http://localhost:3000/user/changePassword/${user._id}`, {
        password: newPassword,
      });
      alert("Contraseña cambiada exitosamente");
      setNewPassword("");
    } catch (err) {
      setError("Error al cambiar la contraseña. Inténtalo nuevamente.");
      console.error("Error changing password:", err);
    }
  };

  function linkClasses(type = null) {
    let classes = "py-2 px-6";
    if (type === subpage) {
      classes += " bg-primary text-white rounded-full";
    } else {
      classes += " bg-gray-200 text-black rounded-full";
    }
    return classes;
  }

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <nav className="w-full flex justify-center mt-9 gap-6">
        <Link className={linkClasses("profile")} to={"/account"}>
          My Profile
        </Link>
        <Link className={linkClasses("bookings")} to={"/account/bookings"}>
          My Bookings
        </Link>
      </nav>

      {subpage === "profile" && (
        <div className="profileContainer">
          <h2>Perfil</h2>
          <p>
            Logged in as <strong>{user.first_name} {user.last_name}</strong> <br />
            Email: <strong>{user.email}</strong>
          </p>
          <button onClick={logout} className="logoutButton">
            Logout
          </button>

          <h3>Cambiar Contraseña</h3>
          <form onSubmit={handleChangePassword} className="changePasswordForm">
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
      )}

      {subpage === "bookings" && (
        bookings.map((item) => (
          <RoomItem
            item={item}
            data={bookings}
            updateBookingList={(deletedBookingId) =>
              setBookings((prev) => prev.filter((item) => item._id !== deletedBookingId))
            }
            key={item._id}
          />
        ))
      )}
    </div>
  );
}
