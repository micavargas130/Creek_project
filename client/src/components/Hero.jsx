/* eslint-disable react/prop-types */
import "../components/Hero.css";

export default function Hero(props){
    return(<>
    <div className={props.cName}></div>
    <img alt="HeroImg" src={props.heroImg}/>
    <div className="hero-text">
        <h1>{props.title}</h1>
        <p>{props.text}</p>
        

    </div>
    
    
    </>

   

    );
}
