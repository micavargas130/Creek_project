import { useEffect, useState } from "react"
import "./roomPage.css"
import useFetch from "../hooks/useFetch";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../components/searchItem/SearchItem";
export default function RoomsPage(){

    const[lodges, setLodges] = useState([]);

    useEffect(()=>{

        axios.get('/lodges/').then(response =>{
            setLodges(response.data);
        });
    },[]);

    const location = useLocation();

   
    const [date, setDate] = useState(location.state.date);
    const [openDate, setOpenDate] = useState(false);
    const [options] = useState(location.state.options);
    const [adult, setAdult] = useState(options.adult);
    const [children, setChildren] = useState(options.children);
    const {data, loading, error, refetch} = useFetch(`/lodges`)
    
    
    const filteredLodges = data.filter(item => item.capacity >= adult+children);
    return(
     
    <div>
      <div className="listContainer">
        <div className="listWrapper">
          <div className="roomWrapper">
            {loading ? ("loading" ): (<>
           
            {filteredLodges.map((item)=> (
              <SearchItem item={item} key={item._id} />
            ))}

            </>
            )}
           
            
        </div>
        </div>
        </div>
         </div>
       
    
    )}