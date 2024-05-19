import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import {Link, Navigate} from "react-router-dom"
const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [name,setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [services, setServices] = useState('');
  const [photos, setPhotos] = useState('');
  const[redirect,setRedirect] = useState(false);

  async function newLodge(ev){
    ev.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      
      // Ahora imagePath contiene la ruta de la imagen en el servidor
      // Agrega imagePath a tu objeto de datos antes de enviarlo
  
      await axios.post("http://localhost:3000/lodges", {
        name,
        description,
        capacity,
        services,
        file // Agrega la ruta de la imagen como cadena
      });
  
      alert("Registro exitoso");
      setRedirect(true);
    } catch (err) {
      alert("Email ya registrado");
    }
  }

 if(redirect){
   return <Navigate to={'/lodges'}/>
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
         
          </div>
          <div className="right">
            <form onSubmit={newLodge}>
              <div className="formInput">
              <input
                type="file"      
                onChange={(e) => {
                  setFile(e.target.files[0].name); // Almacena el nombre del archivo
                }}
/>
              </div>

        <div className="mt-4 grow flex items-center justify-around">
        <div className ="mb-64">
          <div>
       
          <input type="text" placeholder="Nombre de la Cabaña" value={name} onChange={ev => setName(ev.target.value)}/> 
          <input type="text" placeholder="Descripcion" value={description} onChange={ev => setDescription(ev.target.value)}/> 
          <input type="text" placeholder={'Capacidad'} value={capacity} onChange={ev => setCapacity(ev.target.value)}/>
          <input type={'text'} placeholder="Servicios" value={services} onChange={ev => setServices(ev.target.value)}/>
          </div>
          <div className="text-center py-2 text-gray-500">
          </div>
  
        </div>
        </div> 
              <button>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
