import Hero from "../components/Hero.jsx";
import Activities from "../components/index_elements/activities.jsx";
import About from "../components/index_elements/about.jsx";

export default function IndexPage(){
    return(
        <>
            <Hero
                cName="hero"
                heroImg="src/assets/rodeoLake.jpg"
                title="Ven a conocer Rodeo"
                text="Tu descanso es nuestra prioridad"
            />

            <About /> 
            <Activities />
         

        </>
    );
}