import './services.css'; // Asegúrate de crear y definir estilos en este archivo

function Services() {
    return (
        <section className="activities">
            <h2>Contamos con</h2>
            <div className="activity-list">
                <div className="activity-item">
                    <h2>Pileta</h2>
                    <p>Refrescate y disfruta del dia en nuestra amplia pileta!</p>
                </div>
                <div className="activity-item">
                    <h3>Estacionamiento</h3>
                    <p>Espacio techado para proteger tu vehiculo.</p>
                </div>
                <div className="activity-item">
                    <h3>Acceso al rio </h3>
                    <p>Relajate .</p>
                </div>
            </div>
        </section>
    );
}

export default Services;