import Hero from "../components/Hero.jsx";
import Services from "../components/Services.jsx";

export default function IndexPage(){
    return(<>
        <Hero
        cName = "hero"
        heroImg = "src/assets/rodeoLake.jpg"
        title = "Veni a conocer Rodeo"
        text = "Tu descanso es nuestra prioridad" 
        />


        <Services></Services>
    </>


    


    );
}
