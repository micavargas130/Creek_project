import './activities.css'; // Asegúrate de crear y definir estilos en este archivo

function Activities() {
    return (
        <section className="activities">
            <h2>Contamos con</h2>
            <div className="activity-list">
                <div className="activity-item">
                    <h3>Pileta</h3>
                    <p>Explora los hermosos senderos del área.</p>
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

export default Activities;