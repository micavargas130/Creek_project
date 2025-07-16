import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arroyitocamping@gmail.com",
    pass: "etkv pgfv yuda uctb",
  },
});

// Enviar email de confirmación de reserva con creacion de usuario
export const sendBookingEmailwithPass = async (userEmail, userName, password, bookingDetails) => {
  try {
    const now = new Date();
    now.setDate(now.getDate() + 3); // suma 3 días
    const deadline = now.toLocaleDateString("es-AR");

    const mailOptions = {
      from: "Camping Arroyito <arroyitocamping@gmail.com>",
      to: userEmail,
      subject: "Se registró tu reserva- Camping Arroyito",
      html: `
        <h2>Hola, ${userName}!</h2>
        <p>Tu reserva ha sido registrada. Aquí tienes los detalles:</p>
        <ul>
          <li><strong>Fecha de ingreso:</strong> ${bookingDetails.checkIn}</li>
          <li><strong>Fecha de salida:</strong> ${bookingDetails.checkOut}</li>
          <li><strong>Cabaña:</strong> ${bookingDetails.lodgeName}</li>
          <li><strong>Precio Total:</strong> $${bookingDetails.totalPrice}</li>
        </ul>
        <p>Para confirmar la misma, necesitamos que envíes una seña que corresponde al 30% del monto de la reserva (esto se deducira del monto a abonar una vez llegués al camping)</p>
        <p>Detalles de la cuenta</p>
        <ul>
          <li><strong>Monto a transferir (30% del monto de la reserva): </strong> ${(bookingDetails.totalPrice)*0.3}</li>
          <li><strong>CBU: 0002392456109234581993 </strong></li>
          <li><strong>Alias: camping.arroyito.sj </strong></li>
          <li><strong>Titular de la cuenta: Irma Silva </strong></li>
          <li><strong>Banco: Santander Rio</strong></li>
        </ul>
         <p>Una vez transferido por favor enviar comprobante al siguiente whatsapp: 3804345131</p>

        <p><strong>Importante:</strong> Si no se recibe la seña antes del ${deadline}, la reserva podrá ser cancelada automáticamente.</p>
        <br>
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

//sin creacion de usuario
export const sendBookingEmail = async (userEmail, userName, bookingDetails) => {
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
          <li><strong>Cabaña:</strong> ${bookingDetails.lodge.Name}</li>
          <li><strong>Precio Total:</strong> $${bookingDetails.totalPrice}</li>
        </ul>
        <p>Puedes ingresar a <a href="https://www.campingarroyito.com">www.campingarroyito.com</a> para consultar detalles de tu reserva.</p>
        
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

//Email con datos de la cuenta donde mandar la seña
export const sendBookingWithDepositEmail = async (userEmail, userName, password, bookingDetails) => {
  try {
    const now = new Date();
    now.setDate(now.getDate() + 3); // suma 3 días
    const deadline = now.toLocaleDateString("es-AR");

    const mailOptions = {
      from: "Camping Arroyito <arroyitocamping@gmail.com>",
      to: userEmail,
      subject: "Se registró tu reserva - Camping Arroyito",
      html: `
        <h2>Hola, ${userName}!</h2>
        <p>Tu reserva ha sido registrada correctamente. </strong></p>
        <p>Aquí tienes los detalles de tu reserva:</p>
        <ul>
          <li><strong>Fecha de ingreso:</strong> ${bookingDetails.checkIn}</li>
          <li><strong>Fecha de salida:</strong> ${bookingDetails.checkOut}</li>
          <li><strong>Cabaña/Carpa:</strong> ${bookingDetails.lodgeName}</li>
          <li><strong>Precio Total:</strong> $${bookingDetails.totalPrice}</li>
        </ul>
        <p>Para confirmar la misma, necesitamos que envíes una seña que corresponde al 30% del monto de la reserva (esto se deducira del monto a abonar una vez llegués al camping)</p>
        <p>Detalles de la cuenta</p>
        <ul>
          <li><strong>Monto a transferir (30% del monto de la reserva): </strong> ${(bookingDetails.totalPrice)*0.3}</li>
          <li><strong>CBU: 0002392456109234581993 </strong></li>
          <li><strong>Alias: camping.arroyito.sj </strong></li>
          <li><strong>Titular de la cuenta: Irma Silva </strong></li>
          <li><strong>Banco: Santander Rio</strong></li>
        </ul>
         <p>Una vez transferido por favor enviar comprobante al siguiente whatsapp: 3804345131</p>

        <p><strong>Importante:</strong> Si no se recibe la seña antes del ${deadline}, la reserva podrá ser cancelada automáticamente.</p>
        <br>
        <p>¡Gracias por elegirnos!</p>
        <p><strong>Equipo de Camping Arroyito</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo de confirmación enviado a", userEmail);
  } catch (error) {
    console.error("Error enviando el correo de confirmación:", error);
  }
};