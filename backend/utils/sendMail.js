import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("Error verifying SMTP connection:", err);
  } else {
    console.log("SMTP connection verified and ready to send emails.");
  }
});

const sendMail = (toEmail, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Email not send,an error occur: ", error);
    } else {
      console.log("Email sent", info.response);
    }
  });
};

export default sendMail;
