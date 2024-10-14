import { useEffect, useState } from "react";
import "./roomPage.css";
import useFetch from "../hooks/useFetch";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SearchItem from "../components/SearchItem/searchItem";

export default function RoomsPage() {
    const [lodges, setLodges] = useState([]);
    const location = useLocation();
    const [dates, setDates] = useState(location.state.date || []);
    const [options, setOptions] = useState(location.state.options || { adult: 1, children: 0 });
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
        let list = [];
        while (date <= end) {
            list.push(new Date(date).getTime());
            date.setDate(date.getDate() + 1);
        }
        return list;
    }

    const alldates = dates.length > 0 ? getDatesInRange(dates[0].startDate, dates[0].endDate) : [];

    const isAvailable = (lodge) => {
        const unavailableDates = lodge.unavailableDates.map(date => new Date(date).getTime());
        return !alldates.some(date => unavailableDates.includes(date));
    }

    const filteredLodges = data.filter(item => item.capacity >= adult + children && !isAvailable(item));

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
