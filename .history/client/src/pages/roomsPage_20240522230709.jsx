import { useEffect, useState } from "react";
import "./roomPage.css";
import useFetch from "../hooks/useFetch";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SearchItem from "../components/SearchItem/searchItem";

export default function RoomsPage() {
    const [lodges, setLodges] = useState([]);
    const location = useLocation();
    const [dates, setDates] = useState(location.state?.date || []);
    const [options, setOptions] = useState(location.state?.options || { adult: 1, children: 0 });
    const [adult, setAdult] = useState(options.adult);
    const [children, setChildren] = useState(options.children);

  
    

    const filteredLodges = data.filter(item => (item.capacity >= adult + children && dates != item.unavailableDates));

  

    return (
        <div className="listContainer">
            <div className="listWrapper">
                <div className="roomWrapper">
                    {loading ? (
                        "Loading..."
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
