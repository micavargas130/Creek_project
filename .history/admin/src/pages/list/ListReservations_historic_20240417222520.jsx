import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import DatatableReservationsHistoric from "../../components/datatable/DatatableReservations_historic"

const List = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <DatatableReservationsHistoric/>
      </div>
    </div>
  )
}

export default List