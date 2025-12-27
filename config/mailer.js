// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// // export const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 465,
// //   secure: true,
// //   auth: {
// //     user: process.env.SMTP_EMAIL,
// //     pass: process.env.SMTP_PASSWORD
// //   }
// // });


// export const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("SMTP Error:", error);
//   } else {
//     console.log("SMTP Server is ready to send emails ✅");
//   }
// });

import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

