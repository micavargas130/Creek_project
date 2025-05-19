import { Outlet } from "react-router-dom";
import Header from "./header/Header";

<div className="p-1 flex flex-col">
    <Header />
    <div className="flex-grow">
        <Outlet />
    </div>
</div>
