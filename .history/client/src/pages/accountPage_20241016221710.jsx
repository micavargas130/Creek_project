import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import RoomItem from "../components/RoomItem/roomItem.jsx";
import { UserContext } from "../context/UserContext";

export default function AccountPage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  let { subpage } = useParams();

  if (subpage === undefined) {
    subpage = "profile";
  }

  useEffect(() => {
    if (user && subpage === "bookings") {
      axios
        .get(`bookings/${user._id}/bookings`)
        .then((response) => {
          // Filtra las reservas con estado "activo"
          const activeBookings = response.data.filter((booking) => booking.status === "activo");
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

  const updateBookingList = (deletedBookingId) => {
    setBookings((prev) => prev.filter((item) => item._id !== deletedBookingId));
  };

  function linkClasses(type = null) {
    let classes = "py-2 px-6";
    if (type === subpage) {
      classes += " bg-primary rounded-full";
    }
    return classes;
  }

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={"/redirect"} />;
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
        <div className="text-center">
          Logged in as {user.first_name} {user.last_name} with email:{" "}
          {user.email}
          <div>
            <button onClick={logout} className='primary max-w-sm mt-2"'>
              Logout
            </button>
          </div>
        </div>
      )}

      {subpage === "bookings" && (
        bookings.map((item) => (
          <RoomItem
            item={item}
            data={bookings}
            updateBookingList={updateBookingList}
            key={item._id}
          />
        ))
      )}
    </div>
  );
}
