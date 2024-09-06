import './about.css'; // Asegúrate de crear y definir estilos en este archivo

function Activities() {
    return (
        <section className="activities">
            <h2>Actividades</h2>
            <div className="activity-list">
                <div className="activity-item">
                    <h3>Senderismo</h3>
                    <p>Explora los hermosos senderos del área.</p>
                </div>
                <div className="activity-item">
                    <h3>Pesca</h3>
                    <p>Disfruta de un día de pesca en el lago.</p>
                </div>
                <div className="activity-item">
                    <h3>Kayak</h3>
                    <p>Rema en el lago y disfruta del paisaje.</p>
                </div>
            </div>
        </section>
    );
}

export default Activities;