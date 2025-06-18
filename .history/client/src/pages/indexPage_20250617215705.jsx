import Hero from "../components/Hero.jsx";
import Services from "../components/index_elements/services.jsx";
import About from "../components/index_elements/about.jsx";
import Activities from "../components/index_elements/activities.jsx";
import Footer from "../components/index_elements/footer.jsx";
import Reviews from "../components/index_elements/reviews.jsx";

export default function IndexPage(){
    return(
        <>
            <Hero
                cName="hero"
                heroImg="/images/rodeoLake.jpg"
                title="Ven a conocer Rodeo"
                text="Tu descanso es nuestra prioridad"
            />

            <About /> 
            <Services />
            <Activities />
            <Reviews />
            <Footer />
         

        </>
    );
}

<div className="border border-red-500">
{/* Contenido de la página */}
</div>