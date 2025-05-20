import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import './footer.css';

function Review() {

  // Cargar el script de Elfsight solo una vez
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-left">
        {/* Widget de Google Reviews */}
        <div className="elfsight-app-df4be8f4-21d1-482e-a03c-9be61a252ffb" data-elfsight-app-lazy></div>
      </div>
    </footer>
  );
}

export default Review;

