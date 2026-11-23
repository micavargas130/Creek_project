import { Route, Routes } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/indexPage';
import Layout from './Layout';
import LoginPage from './pages/loginPage.jsx';
import RegisterPage from './pages/registerPage.jsx';
import axios from 'axios';
import { UserContextProvider } from './context/UserContext.jsx';
import { SearchContextProvider } from './context/SearchContext';
import AccountPage from "../src/pages/accountPage.jsx";
import RoomsPage from '../src/pages/roomsPage.jsx';
import RoomInfoPage from '../src/pages/roomInfoPage.jsx';
import { API_URL } from './config.js';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

//manda el token de la sesion en cada request (la cookie no siempre viaja entre Vercel y Render)
axios.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("user") || "null")?.token;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//si la sesion expiro o no es valida, se cierra y se vuelve al login
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("user")) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <UserContextProvider>
      <SearchContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/roomsPage" element={<RoomsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/:subpage" element={<AccountPage />} />
            <Route path="/account/:userId/bookings" element={<AccountPage />} />
            <Route path="/lodges/:id" element={<RoomInfoPage />} />
          </Route>
        </Routes>
      </SearchContextProvider>
    </UserContextProvider>
    
  );
}

export default App;
