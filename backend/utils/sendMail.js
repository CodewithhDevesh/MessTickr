import nodemailer from "nodemailer";

export const sendResetEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"LearnState" <${process.env.MAIL_USER}>`,
    to,
    subject: "Reset Your Password",
    html: `<h3>Click the link to reset your password:</h3><a href="${link}">${link}</a>`,
  });
};
