import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import DatatableTentsHistoric from "../../components/datatable/DatatableTents_historic.jsx"

const List = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <DatatableTentsHistoric/>
      </div>
    </div>
  )
}

export default List