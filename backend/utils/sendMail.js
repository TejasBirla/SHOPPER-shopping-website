import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_EMAIL_API);

const sendMail = (toEmail, subject, text) => {
  try {
     resend.emails.send({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject,
      text,
    });
  } catch (error) {
    console.log("Error in sending mail: ", error);
  }
};

export default sendMail;
