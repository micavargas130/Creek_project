
import Sidebar from "../../components/sidebar/Sidebar.jsx"
import Navbar from "../../components/navbar/Navbar.jsx"
import DatatableLodges from "../../components/datatable/DatatableLodges.jsx"
import { useEffect, useState } from "react";

const List = () => { 
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <DatatableLodges/>
      </div>
    </div>
  )
}

export default List