/* eslint-disable react/prop-types */
import "../Hero.css";

export default function Hero(props){
    return(<>
    <div className={props.cName}></div>

    <img className="heroImg" src={props.heroImg}/>
    <div className="hero-text">
        <h1>{props.title}</h1>
        <p>{props.text}</p>
        

    </div>
    
    
    </>

   

    );
}
