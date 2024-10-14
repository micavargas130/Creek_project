import { useEffect, useState } from "react";
import "./roomPage.css";
import useFetch from "../hooks/useFetch";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SearchItem from "../components/SearchItem/searchItem";

export default function RoomsPage() {
    const [lodges, setLodges] = useState([]);
    const location = useLocation();
    const [dates] = useState(location.state.date);
    const [options] = useState(location.state.options);
    const [adult] = useState(options.adult);
    const [children] = useState(options.children);

    useEffect(() => {
        axios.get('/lodges/').then(response => {
            setLodges(response.data);
        });
    }, []);

    const { data, loading } = useFetch(`/lodges`);
    const filteredLodges = data.filter(item => item.capacity >= adult + children);

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
