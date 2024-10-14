import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import <DatatableReservationsHisto></DatatableReservationsHisto> from "../../components/datatable/DatatableReservation_historic"

const List = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <DatatableReservations/>
      </div>
    </div>
  )
}

export default List