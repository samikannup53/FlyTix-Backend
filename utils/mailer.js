const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ to, subject, text, html, replyTo, attachments }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html: html || undefined,
    replyTo: replyTo || undefined,
    attachments: attachments || undefined,
  };

  try {
    const emailResponse = await transporter.sendMail(mailOptions);

    return {
      status: 200,
      msg: "Email sent Successfully",
      messageId: emailResponse.messageId,
      accepted: emailResponse.accepted,
    };
  } catch (error) {
    return { status: 500, msg: "Failed to Send Email", error: error.message };
  }
}

module.exports = sendEmail;
