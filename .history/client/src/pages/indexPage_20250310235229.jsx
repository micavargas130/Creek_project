import Hero from "../components/Hero.jsx";
import Services from "../components/index_elements/services.jsx";
import About from "../components/index_elements/about.jsx";
import Activities from "../components/index_elements/activities.jsx";
import Footer from "../components/index_elements/footer.jsx";

export default function IndexPage(){
    return(
        
        <div className="border border-red-500">

            <Hero
                cName="hero"
                heroImg="src/assets/rodeoLake.jpg"
                title="Ven a conocer Rodeo"
                text="Tu descanso es nuestra prioridad"
            />

            <About /> 
            <Services />
            <Activities />
            <Footer />
         

        </div>
    );
}

<div className="border border-red-500">
{/* Contenido de la página */}
</div>