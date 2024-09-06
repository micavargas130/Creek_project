import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import MapComponent from "../../components/map/mapComponent.jsx";

const New = () => {
  const [file, setFile] = useState("");
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [services, setServices] = useState('');
  const [photos, setPhotos] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [tentToCabin, setTentToCabin] = useState([]);
  const [location, setLocation] = useState({ row: null, col: null });
  const [lodgesInfo, setLodgesInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        const { occupiedPositions } = response.data;

        const lodgesResponse = await axios.get("http://localhost:3000/lodges");
        setLodgesInfo(lodgesResponse.data);

      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };

    fetchData();
  }, []);

  async function newLodge(ev) {
    ev.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/lodges", {
        name,
        description,
        capacity,
        services,
        photos,
        location,
        status: 
      });

      const newLodgeData = response.data; // Datos de la nueva cabaña creada
      setLodgesInfo(prevLodges => [...prevLodges, newLodgeData]); // Agregar la nueva cabaña a lodgesInfo

      alert("Registro exitoso");
      setRedirect(true);
    } catch (err) {
      alert("Error al registrar la cabaña");
    }
  }

  const handleCellClick = (row, col, iconType) => {
    if (iconType === "FestivalRoundedIcon") {
      // Lógica para cambiar la carpa por el icono de cabaña
      const updatedTentToCabin = [...tentToCabin, { row, col }];
      setTentToCabin(updatedTentToCabin);
      setLocation({ row, col });
    }
  };

  if (redirect) {
    return <Navigate to={'/lodges'} />;
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Añadir una nueva cabaña</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <MapComponent onCellClick={handleCellClick} tentToCabin={tentToCabin} lodgesInfo={lodgesInfo} />
          </div>
          <div className="right">
            <form onSubmit={newLodge}>
              <div className="formInput">
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              <div className="mt-4 grow flex items-center justify-around">
                <div className="mb-64">
                  <div>
                    <input type="link" placeholder="Link de la foto" value={photos} onChange={ev => setPhotos(ev.target.value)} />
                    <input type="text" placeholder="Nombre de la Cabaña" value={name} onChange={ev => setName(ev.target.value)} />
                    <input type="text" placeholder="Descripción" value={description} onChange={ev => setDescription(ev.target.value)} />
                    <input type="text" placeholder="Capacidad" value={capacity} onChange={ev => setCapacity(ev.target.value)} />
                    <input type="text" placeholder="Servicios" value={services} onChange={ev => setServices(ev.target.value)} />
                  </div>
                  <div>
                    <button className="primary my-4">Guardar</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
