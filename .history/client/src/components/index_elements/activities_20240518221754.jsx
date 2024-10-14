import './activities.css';

const activities = [
    { title: "Kayak", img: "src/assets/kayak.jpeg" },
    { title: "Cabalgatas", img: "src/assets/cabalgata.jpeg" },
    { title: "Senderismo", img: "src/assets/senderismo.jpeg" },
    { title: "Kite Surf", img: "src/assets/pesca.jpg" },
    { title: "Mountain Bike", img: "src/assets/mountain_bike.jpg" }
];

function Activities() {
    return (
        <section className="san-juan-activities">
            <h2>Actividades en San Juan</h2>
            <div className="activities-grid">
                {activities.map((activity, index) => (
                    <div className="activity-card" key={index}>
                        <img src={activity.img} alt={activity.title} className="activity-image" />
                        <h3 className="activity-title">{activity.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Activities;