import { useEffect, useState, useContext } from "react";
import "./roomPage.css";
import axios from "axios";
import SearchItem from "../components/SearchItem/searchItem";
import { SearchContext } from "../context/SearchContext";
import useFetch from "../hooks/useFetch";

export default function RoomsPage() {
  const [lodges, setLodges] = useState([]);
  const { dates, options } = useContext(SearchContext);
  const [adult, setAdult] = useState(options.adult);
  const [children, setChildren] = useState(options.children);

  useEffect(() => {
    axios.get('/lodges/').then(response => {
      setLodges(response.data);
    });
  }, []);

  const { data, loading } = useFetch(`/lodges`);

  const getDatesInRange = (start, end) => {
    const date = new Date(start.getTime());
    const list = [];
    while (date <= end) {
      list.push(date.toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
    return list;
  }

  const alldates = dates.length > 0 ? getDatesInRange(new Date(dates[0].startDate), new Date(dates[0].endDate)) : [];

  const isAvailable = (lodge) => {
    if (alldates.length === 0) return true;
    const unavailableDates = lodge.unavailableDates.map(date => date.split('T')[0]);
    return !alldates.some(date => unavailableDates.includes(date));
  }

  const filteredLodges = lodges.filter(item => (item.capacity >= adult + children) && isAvailable(item));

  return (
    <div className="listContainer">
      <div className="listWrapper">
        <div className="roomWrapper">
        {loading ? (
                        "Loading..."
                    ) : (
          {filteredLodges.length === 0 ? (
            "No rooms available"
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
