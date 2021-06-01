import nodemailer from "nodemailer";
import mailTransporter from "../config/mail";
import logWrite from '../logger';


export type SendType = {
  from?: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}
export default class MailService {

  static async send(props: SendType): Promise<void> {
    const transporter = await mailTransporter;
    const mail = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: "someone@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
      ...props
    });

    logWrite.info(`Message sent: ${mail.messageId}`);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(mail)}`);
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

}
