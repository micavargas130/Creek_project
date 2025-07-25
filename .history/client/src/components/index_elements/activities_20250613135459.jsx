import './activities.css';

const activities = [
    { title: "Kayak", img: "/images/kayak.jpeg" },
    { title: "Cabalgatas", img: "/images/cabalgata.jpeg" },
    { title: "Senderismo", img: "/images/senderismo.jpeg" },
    { title: "Kite Surf", img: "/images/KiteFest.jpg" },
    { title: "Festivales", img: "src/assets/gastronomia.jpeg" }
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