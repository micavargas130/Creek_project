import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";


export default function Header() {
  const {user} = useContext(UserContext);
  


    return (<div>
        <header className = "p-3 flex justify-between">
         <a href= "" className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"  viewBox="0 0 16 16">
           <path d="M8.416.223a.5.5 0 0 0-.832 0l-3 4.5A.5.5 0 0 0 5 5.5h.098L3.076 8.735A.5.5 0 0 0 3.5 9.5h.191l-1.638 3.276a.5.5 0 0 0 .447.724H7V16h2v-2.5h4.5a.5.5 0 0 0 .447-.724L12.31 9.5h.191a.5.5 0 0 0 .424-.765L10.902 5.5H11a.5.5 0 0 0 .416-.777l-3-4.5z"/>
          </svg>
          <Link to = {'/'} className ="front-bold">Camping Arroyito </Link>
         </a>
         <div className="flex border border-gray-300 rounded-full py-2 px-1 shadow-md shadow-gray-300">
          <div className="p-2">Days </div>
          <div className="border border-l border-gray-300"></div>
          <div className="p-2">room</div>
          <div className="border border-l border-gray-300"></div>
          <div className="p-2">Add guests</div>
          <button className="bg-primary text-white p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          </button>
         </div>

{/*-- Parte del login */}
         <Link to = {user?'/account':'/login'} className="flex gap-2 border border-gray-300 rounded-full p-4 px-4">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
         <div className="flex bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
          </div>
          {!!user && (
            <div>
            {user.first_name}
            </div>
          )} 
         </Link>
        </header>
      </div>
      );
}