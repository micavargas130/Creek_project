import Hero from "../components/Hero.jsx";
import Services from "../components/Services.jsx";
import Activities from "../components/indeActivities.jsx";
import About from "../components/index_elements/about.jsx";
import './IndexPage.css'; // Archivo para estilos generales

export default function IndexPage(){
    return(
        <>
            <Hero
                cName="hero"
                heroImg="src/assets/rodeoLake.jpg"
                title="Ven a conocer Rodeo"
                text="Tu descanso es nuestra prioridad"
            />

            <Services />
            <Activities />
            <About />

        </>
    );
}