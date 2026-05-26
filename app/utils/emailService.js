const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or any other email service
    auth: {
      user: process.env.EMAIL_USER || 'test@example.com',
      pass: process.env.EMAIL_PASS || 'password',
    },
  });

  const mailOptions = {
    from: `To-Do Planner <${process.env.EMAIL_USER || 'test@example.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
