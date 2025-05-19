import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Lodge_x_StatusColumns } from "../../datatablesourceLodge_x_Status.js";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { Link} from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance.js"

const LodgeHistoryPage = () => {
  const { lodgeId } = useParams(); // Obtén el ID de la cabaña
  const [lodgeHistory, setLodgeHistory] = useState([]);

  useEffect(() => {
    const fetchLodgeHistory = async () => {
      try {
        // 1️⃣ Obtener historial de estados de la cabaña
        const response = await axiosInstance.get(`/lodge_x_status/${lodgeId}`);
        const historyData = response.data;
  
        // 2️⃣ Para cada booking, obtener su accounting (si existe)
        const updatedHistory = await Promise.all(
          historyData.map(async (entry) => {
            if (entry.booking) {
              try {
                const accountingResponse = await axiosInstance.get(`/accounting/booking/${entry.booking}`);
                return { ...entry, paymentInfo: accountingResponse.data }; // Agregamos el accounting info
              } catch (error) {
                console.error("Error fetching accounting data:", error);
                return { ...entry, paymentInfo: null }; // Si falla, dejamos el campo vacío
              }
            }
            return entry;
          })
        );

        setLodgeHistory(updatedHistory);
      

      } catch (error) {
        console.error("Error fetching lodge history:", error);
      }
    };
  
    fetchLodgeHistory();
  }, [lodgeId]);

  const actionColumn = [
    {
      field: "action",
       headerName: "Action",
      filterable: false,
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* Verifica si el nombre del estado es "ocupada" */}
            {params.row.status && params.row.status.status === "ocupado" && (
              <Link to={`/accounting/${params.row.paymentInfo._id}`} style={{ textDecoration: "none" }}>
                <div className="viewButton">View</div>
              </Link>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <h1>Historial de la cabaña</h1>
        <Navbar />
        <div className="datatable">
          {/* Verifica si lodgeHistory tiene datos antes de renderizar */}
          {lodgeHistory.length > 0 ? (
            <DataGrid
              className="datagrid"
              rows={lodgeHistory}
              columns={Lodge_x_StatusColumns.concat(actionColumn)} // Añade actionColumn
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
