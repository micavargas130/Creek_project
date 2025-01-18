import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar.jsx"
import Navbar from "../../components/navbar/Navbar.jsx"
import Chart from "../../components/chart/Chart";
import DatatableAccounting from "../../components/datatable/DatatableAccounting.jsx"
import { useEffect, useState } from "react";

const List = () => { 
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <DatatableAccounting/>
        
      
      </div>
       
    </div>
    
  )
}

export default List