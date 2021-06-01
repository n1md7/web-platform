import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export default (async () => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.ethereal.email",
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER || testAccount.user,
      pass: process.env.MAIL_PASS || testAccount.pass,
    },
  });
})() as Promise<Mail<SMTPTransport.SentMessageInfo>>;