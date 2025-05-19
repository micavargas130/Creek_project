import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arroyitocamping@gmail.com",
    pass: "etkv pgfv yuda uctb",
  },
});

// Enviar email de confirmación de reserva
export const sendBookingEmail = async (userEmail, userName, password, bookingDetails) => {
  try {
    const mailOptions = {
      from: "Camping Arroyito <arroyitocamping@gmail.com>",
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
    console.log("Correo de confirmación enviado a", userEmail);
  } catch (error) {
    console.error("Error enviando el correo de confirmación:", error);
  }
};

// Enviar email de cancelación de reserva
export const sendCancellationEmail = async (userEmail, userName, bookingDetails) => {
  try {
    const mailOptions = {
      from: "Camping Arroyito <arroyitocamping@gmail.com>",
      to: userEmail,
      subject: "Cancelación de tu reserva - Camping Arroyito",
      html: `
        <h2>Hola, ${userName}.</h2>
        <p>Lamentamos informarte que tu reserva ha sido cancelada. Aquí están los detalles:</p>
        <ul>
          <li><strong>Fecha de ingreso:</strong> ${bookingDetails.checkIn}</li>
          <li><strong>Fecha de salida:</strong> ${bookingDetails.checkOut}</li>
          <li><strong>Cabaña/Carpa:</strong> ${bookingDetails.lodgeName}</li>
          <li><strong>Precio Total:</strong> $${bookingDetails.totalPrice}</li>
        </ul>
        <p>Si tienes alguna consulta, por favor contáctanos a <a href="mailto:arroyitocamping@gmail.com">arroyitocamping@gmail.com</a>.</p>
        <p>Esperamos poder recibirte en otra ocasión.</p>
        <br>
        <p><strong>Equipo de Camping Arroyito</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo de cancelación enviado a", userEmail);
  } catch (error) {
    console.error("Error enviando el correo de cancelación:", error);
  }
};

export const sendReservationRemainderEmail = async (userEmail, userName, bookingDetails) => {
  try {
    const mailOptions = {
      from: "Camping Arroyito <arroyitocamping@gmail.com>",
      to: userEmail,
      subject: "Cancelación de tu reserva - Camping Arroyito",
      html: `
        <h2>Hola, ${userName}.</h2>
        <p>Lamentamos informarte que tu reserva ha sido cancelada. Aquí están los detalles:</p>
        <ul>
          <li><strong>Fecha de ingreso:</strong> ${bookingDetails.checkIn}</li>
          <li><strong>Fecha de salida:</strong> ${bookingDetails.checkOut}</li>
          <li><strong>Cabaña/Carpa:</strong> ${bookingDetails.lodgeName}</li>
          <li><strong>Precio Total:</strong> $${bookingDetails.totalPrice}</li>
        </ul>
        <p>Si tienes alguna consulta, por favor contáctanos a <a href="mailto:arroyitocamping@gmail.com">arroyitocamping@gmail.com</a>.</p>
        <p>Esperamos poder recibirte en otra ocasión.</p>
        <br>
        <p><strong>Equipo de Camping Arroyito</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo de cancelación enviado a", userEmail);
  } catch (error) {
    console.error("Error enviando el correo de cancelación:", error);
  }
};