import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Lodge_x_StatusColumns } from "../../datatablesourceLodge_x_Status.js";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const LodgeHistoryPage = () => {
  const { lodgeId } = useParams(); // Obtén el ID de la cabaña
  const [lodgeHistory, setLodgeHistory] = useState([]);

  useEffect(() => {
    const fetchLodgeHistory = async () => {
      try {
        const response = await axios.get(`/lodge_x_status?lodge=${lodgeId}`); // Filtra por lodgeId
        setLodgeHistory(response.data);
      } catch (error) {
        console.error("Error fetching lodge history:", error);
      }
    };

    fetchLodgeHistory();
  }, [lodgeId]);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="datatable">
          <h1>Historial de la cabaña</h1>
          {/* Verifica si lodgeHistory tiene datos antes de renderizar */}
          {lodgeHistory.length > 0 ? (
                <DataGrid
                className="datagrid"
                rows={data}
                columns={Lodge_x_StatusColumns}
                pageSize={9}
                rowsPerPageOptions={[9]}
                getRowId={(row) => row._id}
              />
          ) : (
            <p>No hay datos de historial para esta cabaña.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LodgeHistoryPage;
