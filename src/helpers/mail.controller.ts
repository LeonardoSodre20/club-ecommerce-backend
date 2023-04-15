import { createTransport } from "nodemailer";

// PARAMS MAIL
import { IMailParams } from "@interfaces/IMail";

export const sendEmail = ({ to, subject, message }: IMailParams) => {
  if (to === "" || subject === "" || message === "") {
    throw new Error("Paramêtros de E-mail inválidos !");
  }

  const mailOptions = {
    from: "f7a25f041f855a",
    to: to,
    subject: subject,
    html: message,
  };

  const transporter = createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "756b0d3e777001",
      pass: "c991749a0679d1",
    },
  });

  transporter.sendMail(mailOptions, (e, info) => {
    if (e) {
      console.log(e);
    } else {
      console.log(`E-mail sent : ${info.response}`);
    }
  });
};
