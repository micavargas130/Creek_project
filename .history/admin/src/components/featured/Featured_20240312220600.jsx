import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

const Featured = () => {

  const [occupiedPositions, setOccupiedPositions] = useState([]);

  
  return (

    <div className="map-container">
  {/* Crear la cuadrícula */}
  <div className="map">
  {Array.from({ length: 8 }, (_, row) => (
  <div key={row} className="map-row">
    {Array.from({ length: 10 }, (_, col) => {
      const isCellOccupied = occupiedPositions.some(
        (pos) => pos.row === Number(row) && pos.col === Number(col)
      );



          return (
          <div
            key={col}
            id={`${row}-${col}`}
            className={`map-cell ${
              isCellOccupied ? "occupied" : ""
            } ${selectedCell.includes(`${row}-${col}`) ? "selected" : ""}`}
            onClick={() => handleCellClick(row, col)}
          >
            {getIconType(row, col) === "HouseSidingRoundedIcon" && (                                  
              <HouseSidingRoundedIcon className="house-cell" />
            )}
            {getIconType(row, col) === "FestivalRoundedIcon" && (
              <FestivalRoundedIcon className="icon" />
            )}
            {getIconType(row, col) === "OtherHousesIcon" && (
              <OtherHousesIcon className="mainhouse-cell" />
            )}
            {getIconType(row, col) === "PoolIcon" && (
              <PoolIcon className="pool-cell" />
            )}
            {getIconType(row, col) === "RestaurantIcon" && (
              <RestaurantIcon className="restaurant-cell" />
            )}
            {getIconType(row, col) === "GarageIcon" && (
              <GarageIcon className="garage-cell" />
            )}
            {getIconType(row, col) === "GrillIcon" && (
              <GrillIcon className="grill-cell" />
            )}
          </div>
          );
             } )}
      </div>
    ))}
    </div>
    </div>
  );
};

export default Featured;
