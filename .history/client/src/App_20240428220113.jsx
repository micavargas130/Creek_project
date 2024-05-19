import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/indexPage'
import Layout from './Layout'
import LoginPage from './pages/loginPage.jsx'
import RegisterPage from './pages/registerPage.jsx'
import axios from 'axios'
import { UserContextProvider } from './context/UserContext.jsx'
import AccountPage from "../src/pages/accountPage.jsx"
import RoomsPage from '../src/pages/roomsPage.jsx'
import RoomInfoPage from '../src/pages/roomInfoPage.jsx'


axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.withCredentials = true;
function App() {
  return (
<UserContextProvider>
  <Routes>
    <Route path="/" element = {<Layout />}>
      <Route index element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path = "/roomsPage" element={<RoomsPage />} />
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/account/:subpage?" element={<AccountPage />} />
      <Route path="/account/:subpage?bookings" element={<AccountPage />} />
      <Route path="/lodges/:id" element={<RoomInfoPage/>} />
    </Route>
  </Routes> 
</UserContextProvider>
  
      
  )
}

export default App
