import { Outlet } from "react-router-dom";
import Header from "./header/Header";

export default function Layout(){
return(
<div className="p-1 flex flex-col">
    <Header />
    <div className="flex-grow">
        <Outlet />
    </div>
</div>
)


}


