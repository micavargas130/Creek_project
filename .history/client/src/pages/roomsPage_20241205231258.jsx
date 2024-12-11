import { useEffect, useState, useContext } from "react";
import "./roomPage.css";
import axios from "axios";
import SearchItem from "../components/SearchItem/searchItem";
import { SearchContext } from "../context/SearchContext";

export default function RoomsPage() {
  const [lodges, setLodges] = useState([]);
  const { dates, options, key } = location.state || {};

  
  const [adult] = useState(options.adult);
  const [children] = useState(options.children);

 useEffect(() => {
  console.log("Fetching lodges with dates:", dates, "and options:", options);
  axios.get('/lodges').then(response => {
    setLodges(response.data);
  });
}, [contextDates, contextOptions]); // Use effect when these change


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

  const isAvailable = (lodge) => {
    if (alldates.length === 0) return true;
    const unavailableDates = lodge.unavailableDates.map(date => date.split('T')[0]);
    return !alldates.some(date => unavailableDates.includes(date));
  };

  const filteredLodges = lodges.filter(item => (item.capacity >= adult + children) && isAvailable(item));

  return (
    <div key={key} className="listContainer">
      <div className="listWrapper">
        <div className="roomWrapper">
          {filteredLodges.length === 0 ? (
            <div className="noRooms">
              <h3>Oh no! No hay habitaciones disponibles.</h3>
              <h3>Igualmente tenemos lugar disponible para acampar!</h3>
              <div className="activity-images">
                <img src="src/assets/asador.jpg" className="activity-image" alt="Asador" />
                <img src="src/assets/campingspace.jpeg" className="activity-image" alt="Espacio para acampar" />
                <img src="src/assets/carpas.jpeg" className="activity-image" alt="Carpas" />
                <img src="src/assets/sauces.jpeg" className="activity-image" alt="Sauces" />
              </div>
              <h3>¡Te esperamos!</h3>
            </div>
          ) : (
            filteredLodges.map((item) => (
              <SearchItem item={item} key={item._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
