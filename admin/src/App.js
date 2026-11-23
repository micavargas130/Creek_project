import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
import ChangePassword from "./pages/login/changePass.jsx"
import "./utils/subscriptions.js";


// Lists
import ListReservations from "./pages/list/ListReservations.jsx";
import ListTents from "./pages/list/ListTents.jsx";
import ListEmployees from "./pages/list/ListEmployees.jsx";
import ListAccounting from "./pages/list/ListAccounting.jsx";
import ListLodges from "./pages/list/ListLodges.jsx";
import ListReservationsHistoric from "./pages/list/ListReservations_historic.jsx";
import ListTentsHistoric from "./pages/list/ListTents_historic.jsx";
// Singles
import SingleReservations from "./pages/single/SingleReservations.jsx";
import SingleLodges from "./pages/single/SingleLodges.jsx";
import SingleEmployee from "./pages/single/SingleEmployee.jsx";
import SingleAccounting from "./pages/single/SingleAccounting.jsx";

// News
import NewPrices from "./pages/new/NewPrices.jsx";
import NewLodge from "./pages/new/NewLodge.jsx";
import NewAccounting from "./pages/new/NewAccounting.jsx";
import NewTent from "./pages/new/NewTent.jsx";
import NewEmployee from "./pages/new/NewEmployee.jsx";
import NewReservation from "./pages/new/NewReservation.jsx";
import Loading from "./pages/login/Loading.jsx";

import LodgeHistoryPage from "./components/datatable/DatatableLodgeHistory.jsx";

// Others
import LodgeInfo from "./pages/lodgeInfo/lodgeInfo.jsx";
import AdminPortal from "./pages/adminPortal/adminPortal.jsx";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext, UserContextProvider } from '../src/context/UserContext.jsx';

//cualquier pagina del panel requiere estar logueado (admin o empleado)
const ProtectedRoute = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

//estadisticas, contabilidad y empleados son solo para administradores (igual que en el Sidebar)
const AdminRoute = () => {
  const { user } = useContext(UserContext);

  if (user?.isEmployee && !user?.isAdmin) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

function App() {
  
  return (
    <BrowserRouter>
      <UserContextProvider> 
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route path="loading" element={<Loading />} />
            <Route element={<ProtectedRoute />}>
            <Route path="change-password" element={<ChangePassword />} />
            <Route index element={<Home />} />
            <Route path="bookings">
              <Route index element={<ListReservations />} />
              <Route path=":bookingId" element={<SingleReservations />} />
              <Route path="historic" element={<ListReservationsHistoric />} />
              <Route path="new" element={<NewReservation />} />
            </Route>
            <Route path="lodges">
              <Route index element={<ListLodges />} />
              <Route path=":lodgeId" element={<SingleLodges />} />
              <Route path="new" element={<NewLodge />} />
              <Route path="lodgeInfo/:lodgeId" element={<LodgeInfo />} />
              <Route path="history/:lodgeId" element={<LodgeHistoryPage/>} />
              
            </Route>
            <Route path="tents">
              <Route index element={<ListTents />} />
              <Route path="new" element={<NewTent />} />
              <Route path="historico" element={<ListTentsHistoric />} />
            </Route>
            <Route element={<AdminRoute />}>
            <Route path="accounting">
              <Route index element={<ListAccounting />} />
              <Route path="new" element={<NewAccounting />} />
              <Route path="newPrices" element={<NewPrices />} />
              <Route path=":accountingId" element={<SingleAccounting />} />
            </Route>
            <Route path="employees">
              <Route index element={<ListEmployees />} />
              <Route path=":employeeId" element={<SingleEmployee />} />
              <Route path="new" element={<NewEmployee />} />
            </Route>
            <Route path="admin">
              <Route index element={<AdminPortal />} />
            </Route>
            </Route>
            </Route>
          </Route>
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;