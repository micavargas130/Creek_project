import "./datatable.scss";
import WidgetsContainer from "../../components/widget/widgetContainer";
import { getTotalMoney, getIncomes, getExpenses } from "../../components/widget/accountingUtils.jsx";
import Chart from "../../components/chart/ChartAccounting.jsx";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { userColumns, userRows } from "../../datatablesourceAccounting.js";
import { Link, Navigate} from "react-router-dom";
import {useNavigate} from "react-router-dom";

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";

import axios from "axios";

const Datatable = (props) => {
  const {data, loading, error} = useFetch("/accounting")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [maintenanceText, setMaintenanceText] = useState("");
  const [selectedParams, setSelectedParams] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("pagada");
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  const totalIncome = getIncomes(data);
  const totalExpense = getExpenses(data);
  const totalMoney = getTotalMoney(data);




  return (
    <div className="datatable">
      <div className="datatableTitle">Contabilidad</div>
   
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />

   

  <Dialog open={isStatusDialogOpen} onClose={closeStatusOptions}>
  <DialogTitle>Cambiar Estado del Pago</DialogTitle>
  <DialogContent>
    <select value={selectedStatus} onChange={handleStatusSelect}>
      <option value="pagada">Pagada</option>
      <option value="parcial">Parcial</option>
      <option value="pendiente">Pendiente</option>
    </select>
  </DialogContent>
  <DialogActions>
    <Button onClick={closeStatusOptions} color="primary">Cancelar</Button>
    <Button onClick={() => handleStatusChange(selectedParams)} color="primary">Guardar</Button>
  </DialogActions>
</Dialog>

      <div className="chartsContainer">
        <Chart aspect={4 / 1} title="Evolución del Dinero" data={processDataForChart(data)} />
        <WidgetsContainer totalMoney={totalMoney} totalIncome={totalIncome} totalExpense={totalExpense} />
      </div>
    </div>
  );
};

export default Datatable;
