
import { useEffect } from 'react';

function Review() {

  // Cargar el script de Elfsight solo una vez
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <reviews className="reviews">
    
        {/* Widget de Google Reviews */}
        <div className="elfsight-app-df4be8f4-21d1-482e-a03c-9be61a252ffb" data-elfsight-app-lazy></div>
     
    </reviews>
  );
}

export default Review;

