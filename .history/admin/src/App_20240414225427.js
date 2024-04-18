import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
// Lists
import ListReservations from "./pages/list/ListReservations.jsx";
import ListTents from "./pages/list/ListTents.jsx";
import ListEmployees from "./pages/list/ListEmployees.jsx";
import ListAccounting from "./pages/list/ListAccounting.jsx";
import ListLodges from "./pages/list/ListLodges.jsx";
// Singles
import SingleReservations from "./pages/single/SingleReservations.jsx";
import SingleLodges from "./pages/single/SingleLodges.jsx";
import SingleEmployee from "./pages/single/SingleEmployee.jsx";
// News
import NewLodge from "./pages/new/NewLodge.jsx";
import NewAccounting from "./pages/new/NewAccounting.jsx";
import NewTent from "./pages/new/NewTent.jsx";
import NewEmployee from "./pages/new/NewEmployee.jsx";
// Others
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../src/context/AuthContext.js";
import { UserProvider } from './context/UserContext';

function App() {

  const ProtectedRoute = ({children}) => {
  const {user} = useContext(AuthContext)

    if(!user){
      return <Navigate to="/login" />
    }

    return children;
  }

  return (
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/">
              <Route path="login" element={<Login />} />
              <Route 
                index
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route path="bookings">
                <Route index element={<ListReservations />} />
                <Route path=":bookingId" element={<SingleReservations />} />
              </Route>
              <Route path="lodges">
                <Route index element={<ListLodges />} />
                <Route path=":lodgeId" element={<SingleLodges />} />
                <Route path="new" element={<NewLodge />} />
              </Route>
              <Route path="tents">
                <Route index element={<ListTents />} />
                <Route path="new" element={<NewTent />} />
              </Route>
              <Route path="accounting">
                <Route index element={<ListAccounting />} />
                <Route path="new" element={<NewAccounting />} />
              </Route>
              <Route path="employees">
                <Route index element={<ListEmployees />} />
                <Route path=":employeeId" element={<SingleEmployee />} />
                <Route path="new" element={<NewEmployee />} />
              </Route>
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
  );
}

export default App;
