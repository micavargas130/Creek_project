
import Slider from 'react-slick';
import './About.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function About() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    const images = [
        "src/assets/cabañas.jpg",
        "src/assets/pileta.jpg",
        "src/assets/asador.jpg"
    ];

    return (
        <section className="about">
            <div className="about-content">
                <h2>Sobre Nosotros</h2>
                <p>
                    Bienvenido a nuestro camping. Aquí podrás disfrutar de la naturaleza y relajarte
                    en un ambiente tranquilo y acogedor. Ofrecemos una variedad de actividades y servicios
                    para hacer de tu estancia una experiencia inolvidable.
                </p>
            </div>
            <div className="carousel-container">
                <Slider {...settings}>
                    {images.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt={`Camping ${index + 1}`} className="carousel-image" />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}

export default About;