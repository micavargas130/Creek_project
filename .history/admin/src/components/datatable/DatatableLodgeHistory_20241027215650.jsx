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
      <div className="datatableTitle">Contabilidad</div>
   
      <DataGrid
        className="datagrid"
        rows={data}
        columns={Lodge_x_StatusColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />
    </div>
    </div>
    </div>
  );
};

export default Datatable;