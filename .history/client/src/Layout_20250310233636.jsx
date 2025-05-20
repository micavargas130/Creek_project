import { Outlet } from "react-router-dom";
import Header from "./header/Header";

export default function Layout(){
return(
    <div className="p-10 flex flex-col min-h-screen">
        <Header/>
        <Outlet/>
        
    </div>
)


}