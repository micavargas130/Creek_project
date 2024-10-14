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

    useEffect(() => {
        axios.get('/lodges/').then(response => {
            setLodges(response.data);
        });
    }, []);

    const { data, loading } = useFetch(`/lodges`);

    // Helper function to generate a list of dates within the range
    const getDatesInRange = (start, end) => {
        const date = new Date(start.getTime());
        const list = [];
        while (date <= end) {
            list.push(date.toISOString().split('T')[0]); // Convert to string in 'YYYY-MM-DD' format
            date.setDate(date.getDate() + 1);
        }
        return list;
    }

    // Make sure dates array is not empty before trying to access its elements
    const alldates = dates.length > 0 ? getDatesInRange(new Date(dates[0].startDate), new Date(dates[0].endDate)) : [];

    const isAvailable = (lodge) => {
        if (alldates.length === 0) return true; // If no dates are selected, consider all lodges as available
        const unavailableDates = lodge.unavailableDates.map(date => date.split('T')[0]); // Convert to 'YYYY-MM-DD' format
        // Check if any of the selected dates overlap with unavailable dates
        return alldates.some(date => unavailableDates.includes(date));
    }

    console.log(lodge.unavailableDates)
    

    const filteredLodges = data.filter(item => (isAvailable(item)));

  

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
