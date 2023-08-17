import { UserContext} from "../UserContext";
import { useState } from "react";
import { useContext } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios"

export default function AccountPage(){
    const [redirect, setRedirect] = useState(null);
    const{ready,user,setUser} = useContext(UserContext);
    
    let {subpage} = useParams();
    
    if (subpage === undefined){
        subpage = 'profile';
    }

    async function logout(){
        await axios.post('/logout');
        setUser(null);
        setRedirect('/');
    }



    function linkClasses(type=null) {
        let classes = 'py-2 px-6';
        if (type === subpage){
            classes += ' bg-primary rounded-full';
        }
        return classes;

    }

    if(!ready){
        return 'Loading...';
    }
    
    if (ready && !user){
        return <Navigate to={'/login'} />
    }

    if(redirect){
        return <Navigate to={'redirect'}/>
    }


    return (
       <div>
        <nav className="w-full flex justify-center mt-9 gap-6">
        <Link className={linkClasses('profile')} to ={'/account'}> My Profile</Link>
        <Link className={linkClasses('bookings')} to ={'/account/bookings'}> My Bookings</Link>
        </nav>
        {subpage === 'profile' && (
            <div className="text-center">
                Logged in as {user.first_name} {user.last_name} with email: {user.email}
                <div>
                <button onClick={logout} className = 'primary max-w-sm mt-2"'>Logout</button>
                </div>
       
        </div>
        )}

       </div>


    );
}