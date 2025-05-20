import { useEffect, useState, useContext } from "react";
import "./roomPage.css";
import axios from "axios";
import SearchItem from "../components/SearchItem/searchItem";
import { SearchContext } from "../context/SearchContext";

export default function RoomsPage() {
  const [lodges, setLodges] = useState([]);
  const { dates, options } = useContext(SearchContext);
  const [adult] = useState(options.adult);
  const [children] = useState(options.children);
  const [availableLodges, setAvailableLodges] = useState([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  const fetchLodges = async () => {
    try {
      setLoading(true);

      // Obtener todas las cabañas
      const response = await axios.get('/lodges/');
      const allLodges = response.data;

      // Filtrar cabañas disponibles
      const filteredLodges = await Promise.all(
        allLodges.map(async (lodge) => {
          const available = await isAvailable(lodge);
          return available ? lodge : null;
        })
      );

      // Guardar en el estado solo las disponibles
      setAvailableLodges(filteredLodges.filter((lodge) => lodge !== null));

    } catch (error) {
      console.error("Error obteniendo cabañas:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchLodges();
}, []);


  const getDatesInRange = (start, end) => {
    const date = new Date(start.getTime());
    const list = [];
    while (date <= end) {
      list.push(date.toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
    return list;
  };

  const alldates = dates && dates.length > 0 ? getDatesInRange(new Date(dates[0].startDate), new Date(dates[0].endDate)) : [];

  const isAvailable = async (lodge) => {
    if (alldates.length === 0) return true;
  
    try {
      // Obtiene las fechas ocupadas desde el backend
      const res = await axios.get(`/lodges/occupied-dates/${lodge._id}`);
      const occupiedDates = res.data.occupiedDates.map(date => date.split('T')[0]);
      console.log("filtrado", res.data);

  
      // Compara si alguna de las fechas seleccionadas está ocupada
      return !alldates.some(date => occupiedDates.includes(date));
    } catch (error) {
      console.error("Error obteniendo disponibilidad:", error);
      return true; // En caso de error, asumimos que está disponible
    }
  };
  

  const filteredLodges = async () => {
    const filteredLodges = await Promise.all(
      lodges.map(async (lodge) => {
        const available = await isAvailable(lodge);
        return available ? lodge : null;
      })
    );
  
    return filteredLodges.filter((lodge) => lodge !== null);
  };
  

  return (
    <div className="listContainer">
      <div className="listWrapper">
        <div className="roomWrapper">
          {loading ? (
            <p>Cargando cabañas...</p>
          ) : availableLodges.length === 0 ? (
            <div className="noRooms">
              <h3>Oh no! No hay habitaciones disponibles.</h3>
              <h3>Igualmente tenemos lugar disponible para acampar!</h3>
              <div className="activity-images">
                <img src="src/assets/campingspace.jpeg" className="activity-image" alt="Espacio para acampar" />
                <img src="src/assets/carpas.jpeg" className="activity-image" alt="Carpas" />
                <img src="src/assets/sauces.jpeg" className="activity-image" alt="Sauces" />
              </div>
              <h3>¡Te esperamos!</h3>
            </div>
          ) : (
            availableLodges.map((item) => (
              <SearchItem item={item} key={item._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
