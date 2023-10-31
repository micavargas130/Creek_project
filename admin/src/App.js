import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
import ListReservations from "./pages/list/ListReservations.jsx";
import ListLodges from "./pages/list/ListLodges.jsx";
import Single from "./pages/single/Single.jsx";
import New from "./pages/new/New.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource.js";
import "./style/dark.scss";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.js";

function App() {

  const ProtectedRoute = ({children}) => {
    const {user} = useContext(AuthContext)

    if(!user){
      return <Navigate to = "login" />
    }

    return children;
  }

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route 
              index
              element = {
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
            <Route path="bookings">
              <Route index element={<ListReservations />} />
              <Route path=":bookingId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={userInputs} title="Add New User" />}
              />
            </Route>
            <Route path="lodges">
              <Route index element={<ListLodges />} />
              <Route path=":lodgeId" element={<Single />} />
              <Route
                path="new"
                element={<New inputs={productInputs} title="Add New Product" />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
