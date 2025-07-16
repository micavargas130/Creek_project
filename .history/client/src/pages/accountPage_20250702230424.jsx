import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import RoomItem from "../components/RoomItem/roomItem.jsx";
import { UserContext } from "../context/UserContext";
import { Eye, EyeOff } from "lucide-react"; 

export default function AccountPage() {
  const { ready, user, setUser } = useContext(UserContext);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); 
  let { subpage } = useParams();
  const navigate = useNavigate();
  
  if (subpage === undefined) {
    subpage = "profile";
  }
  useEffect(() => {
    console.log("usuario", user);
    if (user?._id && subpage === "bookings") {
      setLoadingBookings(true); // inicia carga
      axios.get(`/bookings/${user._id}/bookings`) 
        .then((response) => {
          const activeBookings = response.data.filter(
            (booking) =>( booking.status?.status === "Activa" ||  booking.status?.status === "Pendiente") 
          );
          const sortedBookings = activeBookings.sort(  (a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setBookings(sortedBookings);
        })
        .catch((error) => {
          console.error("Error fetching bookings:", error);
        })
        .finally(() => {
          setLoadingBookings(false); // finaliza carga
        });
    }
  }, [ready, user, subpage]);

  async function logout() {
    try {
      await axios.post("/logout");
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error("Error en logout:", err);
    }
  }
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.put(`/user/changePassword/${user._id}`, {
        password: newPassword,
      });
      alert("Contraseña cambiada exitosamente");
      setNewPassword("");
    } catch (err) {
      setError("Error al cambiar la contraseña. Inténtalo nuevamente.");
      console.error("Error changing password:", err);
    }
  };

  const updateBookingList = (deletedBookingId) => {
    setBookings((prev) => prev.filter((item) => item._id !== deletedBookingId));
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

  if (ready && !user) {
    navigate('/login');
  }
  
  return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <div>
        <nav className="w-full flex justify-center mt-6 gap-9">
          <Link className={linkClasses("profile")} to={"/account"}>
            Mi Perfil
          </Link>
          <Link className={linkClasses("bookings")} to={"/account/bookings"}>
            Mis Reservas
          </Link>
        </nav>
        {subpage === "profile" && user && (
          <div className="text-center mt-4">
            Ingresaste como {user.first_name} {user.last_name} con el Email:{" "}
            {user.email}
            <div className="text-center bg-white p-8 rounded-lg shadow-lg w-100 mt-4">
            <h3 className="text-xl font-medium mb-2">Cambiar Contraseña</h3>
              <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="inputField w-full p-2 border-2 border-[#0dbf84] rounded-full text-center pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <button type="submit" className="btn-primary w-full">
                  Cambiar
                </button>
              </form>
            </div>
            <div>
              <button onClick={logout} className="primary max-w-sm mt-2">
                Logout
              </button>
            </div>
          </div>
        )}
  
         {subpage === "bookings" && (
          
         <>
           {
           loadingBookings ? (
             <p className="text-center mt-4">Cargando tus reservas...</p>
           ) : bookings.length > 0 ? (
             bookings.map((item) => (
               <RoomItem
                 item={item}
                 data={bookings}
                 updateBookingList={updateBookingList}
                 key={item._id}
               />
             ))
           ) : (
             <p className="text-center mt-4">No tenés reservas activas.</p>
           )}
         </>
       )}
      </div>
    </div>
  );}  