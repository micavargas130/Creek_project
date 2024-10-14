import './Footer.css';
//import FacebookIcon from '@mui/icons-material/Facebook';
//import CallIcon from '@mui/icons-material/Call';
//import WhatsAppIcon from '@mui/icons-material/WhatsApp';


function Footer() {
    return (
        <footer className="footer">
            <div className="footer-left">
                <h1>Nuestra ubicacion</h1>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3495322.8731529354!2d-69.3450133206615!3d-31.181886253738554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9684bcb8664252f3%3A0x4cb88698a80b35c9!2sCamping%20Arroyito!5e0!3m2!1ses-419!2sar!4v1716083532028!5m2!1ses-419!2sar"
                    width="400"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                ></iframe>
            </div>
            <div className="footer-right">
                <h1>Contactanos:</h1>
                <div className="social-links">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                  
                    <a href="<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
  <path fillRule="evenodd" d="m3.855 7.286 1.067-.534a1 1 0 0 0 .542-1.046l-.44-2.858A1 1 0 0 0 4.036 2H3a1 1 0 0 0-1 1v2c0 .709.082 1.4.238 2.062a9.012 9.012 0 0 0 6.7 6.7A9.024 9.024 0 0 0 11 14h2a1 1 0 0 0 1-1v-1.036a1 1 0 0 0-.848-.988l-2.858-.44a1 1 0 0 0-1.046.542l-.534 1.067a7.52 7.52 0 0 1-4.86-4.859Z" clipRule="evenodd" />
</svg>
" target="_blank" rel="noopener noreferrer">Twitter</a>
                </div>
            </div>
        </footer>
    );

}
export default Footer;