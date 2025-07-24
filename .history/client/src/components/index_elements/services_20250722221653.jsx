import './services.css'; // Asegúrate de crear y definir estilos en este archivo

function Services() {
    return (
        <section className="activities">
            <h2>Contamos con</h2>
            <div className="activity-list">
                <div className="activity-item">
                    <h2>Pileta</h2>
                    <p>Refrescate en </p>
                </div>
                <div className="activity-item">
                    <h3>Estacionamiento</h3>
                    <p>Disfruta de un día de pesca en el lago.</p>
                </div>
                <div className="activity-item">
                    <h3>Acceso al rio </h3>
                    <p>Rema en el lago y disfruta del paisaje.</p>
                </div>
            </div>
        </section>
    );
}

export default Services;