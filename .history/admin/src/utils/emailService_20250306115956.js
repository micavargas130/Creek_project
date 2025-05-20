const nodemailer = require("nodemailer");
import nodemailer from "nodemailer"

const sendBookingEmail = async (userEmail, userName, password, bookingDetails) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // O usa otro servicio SMTP
      auth: {
        user: "tuemail@gmail.com", // Cambia esto por tu email
        pass: "tupassword", // Usa una contraseña de aplicación si usas Gmail
      },
    });

    const mailOptions = {
      from: "Camping Arroyito <tuemail@gmail.com>",
      to: userEmail,
      subject: "Confirmación de tu reserva - Camping Arroyito",
      html: `
        <h2>Hola, ${userName}!</h2>
        <p>Tu reserva ha sido confirmada. Aquí tienes los detalles:</p>
        <ul>
          <li><strong>Fecha de ingreso:</strong> ${bookingDetails.checkIn}</li>
          <li><strong>Fecha de salida:</strong> ${bookingDetails.checkOut}</li>
          <li><strong>Cabaña/Carpa:</strong> ${bookingDetails.lodgeName}</li>
          <li><strong>Precio Total:</strong> $${bookingDetails.totalPrice}</li>
        </ul>
        <p>Puedes ingresar a <a href="https://www.campingarroyito.com">www.campingarroyito.com</a> con:</p>
        <ul>
          <li><strong>Usuario:</strong> ${userEmail}</li>
          <li><strong>Contraseña temporal:</strong> ${password}</li>
        </ul>
        <p>Por favor, cambia tu contraseña desde tu perfil una vez que ingreses.</p>
        <p>¡Te esperamos pronto!</p>
        <br>
        <p><strong>Equipo de Camping Arroyito</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado correctamente a", userEmail);
  } catch (error) {
    console.error("Error enviando el correo:", error);
  }
};

// Exportar la función
module.exports = sendBookingEmail;
