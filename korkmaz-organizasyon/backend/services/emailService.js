const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn('EMAIL_USER and EMAIL_PASS should be defined in the environment for email notifications.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const sendNewReservationEmail = async (reservation) => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    return;
  }

  const formattedDate = reservation.date.toISOString().split('T')[0];
  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_USER,
    subject: `Yeni Rezervasyon: ${reservation.eventType} - ${formattedDate} ${reservation.time}`,
    html: `
      <h2>Yeni Korkmaz Organizasyon Rezervasyonu</h2>
      <p><strong>Ad Soyad:</strong> ${reservation.name}</p>
      <p><strong>Telefon:</strong> ${reservation.phone}</p>
      <p><strong>Organizasyon Türü:</strong> ${reservation.eventType}</p>
      <p><strong>Tarih:</strong> ${formattedDate}</p>
      <p><strong>Saat:</strong> ${reservation.time}</p>
      <p><strong>Fiyat:</strong> ${reservation.price.toLocaleString('tr-TR')} TL</p>
      <p><strong>Not:</strong> ${reservation.note || 'Yok'}</p>
      <p><em>Rezervasyon sistemi tarafından otomatik gönderildi.</em></p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendNewReservationEmail
};
