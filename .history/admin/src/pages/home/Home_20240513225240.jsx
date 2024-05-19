import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import { UserContext } from "../../context/UserContext.jsx";
import Table from "../../components/table/Table";

const Home = () => {
  const { user } = useContext(UserContext);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Verifica si el usuario ya está cargado y marca la pantalla como cargada
    if (user && !loaded) {
      setLoaded(true);
    }
  }, [user, loaded]);

  useEffect(() => {
    // Recarga la página una vez cuando el estado de 'loaded' cambia a verdadero
    if (loaded) {
      window.location.reload();
    }
  }, [loaded]);

  return (
    <div className="home">
      
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        
        <div className="widgets">
          <Widget type="user" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>
      </div>
    </div>
  );
};

export default Home;

