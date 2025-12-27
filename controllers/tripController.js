// import { transporter } from "../config/mailer.js";
// import PDFDocument from "pdfkit";

// // Generate Attractive PDF
// const generatePdfBuffer = (data) => {
//   return new Promise((resolve) => {
//     const doc = new PDFDocument({ size: "A4", margin: 50 });
//     const buffers = [];

//     doc.on("data", buffers.push.bind(buffers));
//     doc.on("end", () => resolve(Buffer.concat(buffers)));

//     // PDF Header
//     doc.fillColor("#1e40af").fontSize(26).text("Trip Registration Confirmation", {
//       align: "center",
//       underline: true,
//     });

//     doc.moveDown(1);
//     doc.moveTo(50, 80).lineTo(545, 80).stroke("#1e40af");
//     doc.moveDown(2);

//     // User Info Table
//     const info = [
//       ["Name", data.name],
//       ["Email", data.email],
//       ["Phone", data.phone],
//       ["Father Name", data.fatherName],
//       ["Mother Name", data.motherName],
//       ["Trip Selected", data.trip],
//     ];

//     let y = 120;
//     const itemX = 50;
//     const valueX = 200;

//     info.forEach(([label, value], index) => {
//       // alternating row background
//       const bgColor = index % 2 === 0 ? "#e0f2fe" : "#fef3c7";
//       doc.rect(itemX - 5, y - 2, 490, 25).fillAndStroke(bgColor, "#1e40af");
//       doc.fillColor("#1e40af").fontSize(12).text(label, itemX, y);
//       doc.fillColor("#000").text(value, valueX, y);
//       y += 30;
//     });

//     doc.moveDown(3);

//     // Footer Note
//     doc.fillColor("#1e3a8a").fontSize(14).text(
//       "Thank you for registering! Our team will contact you soon with further details.",
//       { align: "center" }
//     );

//     doc.moveDown(1);
//     doc.moveTo(50, 700).lineTo(545, 700).stroke("#1e40af");

//     doc.end();
//   });
// };

// export const submitTripForm = async (req, res) => {
//   try {
//     const { name, email, phone, fatherName, motherName, trip } = req.body;

//     if (!name || !email || !phone || !trip) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const pdfBuffer = await generatePdfBuffer({ name, email, phone, fatherName, motherName, trip });

//     // Modern Email HTML with attractive CSS
//     const userMail = {
//       from: process.env.SMTP_EMAIL,
//       to: email,
//       subject: "✅ Trip Registration Successful",
//       html: `
//       <div style="font-family:Arial, sans-serif; background:#f0f4f8; padding:20px;">
//         <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:15px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
          
//           <!-- Header -->
//           <div style="text-align:center; padding:25px; background:linear-gradient(90deg, #2563eb, #1e40af); color:white; border-bottom:5px solid #1e3a8a;">
//             <h1 style="margin:0; font-size:24px;">Trip Registration Successful 🎉</h1>
//           </div>

//           <!-- Body -->
//           <div style="padding:25px; color:#333;">
//             <p style="font-size:16px;">Hello <strong>${name}</strong>,</p>
//             <p style="font-size:16px;">Your trip registration is successfully completed! Here are your details:</p>

//             <table style="width:100%; border-collapse:collapse; margin-top:20px; font-size:14px;">
//               <tr style="background:#e0f2fe;"><td style="padding:10px; font-weight:bold;">Name</td><td style="padding:10px;">${name}</td></tr>
//               <tr><td style="padding:10px; font-weight:bold; background:#fef3c7;">Email</td><td style="padding:10px;">${email}</td></tr>
//               <tr style="background:#e0f2fe;"><td style="padding:10px; font-weight:bold;">Phone</td><td style="padding:10px;">${phone}</td></tr>
//               <tr><td style="padding:10px; font-weight:bold; background:#fef3c7;">Father Name</td><td style="padding:10px;">${fatherName}</td></tr>
//               <tr style="background:#e0f2fe;"><td style="padding:10px; font-weight:bold;">Mother Name</td><td style="padding:10px;">${motherName}</td></tr>
//               <tr><td style="padding:10px; font-weight:bold; background:#fef3c7;">Trip Selected</td><td style="padding:10px;">${trip}</td></tr>
//             </table>

//             <p style="margin-top:20px; font-size:16px;">📎 Your confirmation PDF is attached.</p>
//             <p style="font-size:16px; color:#1e40af;">We are excited to see you on this trip! 🌄</p>
//           </div>

//           <!-- Footer -->
//           <div style="background:#f0f4f8; padding:15px; text-align:center; font-size:13px; color:#555;">
//             © ${new Date().getFullYear()} Trip Management System
//           </div>

//         </div>
//       </div>
//       `,
//       attachments: [
//         { filename: "Trip-Confirmation.pdf", content: pdfBuffer },
//       ],
//     };

//     // Admin email
//     const adminMail = {
//       from: process.env.SMTP_EMAIL,
//       to: process.env.ADMIN_EMAIL,
//       subject: "📩 New Trip Registration",
//       html: `
//         <div style="font-family:Arial,sans-serif;">
//           <h2 style="color:#1e40af;">New Trip Submission</h2>
//           <ul style="font-size:14px; color:#333;">
//             <li><strong>Name:</strong> ${name}</li>
//             <li><strong>Email:</strong> ${email}</li>
//             <li><strong>Phone:</strong> ${phone}</li>
//             <li><strong>Father Name:</strong> ${fatherName}</li>
//             <li><strong>Mother Name:</strong> ${motherName}</li>
//             <li><strong>Trip:</strong> ${trip}</li>
//           </ul>
//         </div>
//       `,
//       attachments: [
//         { filename: "User-Trip-Details.pdf", content: pdfBuffer },
//       ],
//     };

//     await transporter.sendMail(userMail);
//     await transporter.sendMail(adminMail);

//     res.status(200).json({ success: true, message: "Email & PDF sent successfully" });

//   } catch (error) {
//     console.error("Email Error:", error);
//     res.status(500).json({ success: false, message: "Email sending failed" });
//   }
// };


import PDFDocument from "pdfkit";
import { resend } from "../config/mailer.js";

// PDF Generator
const generatePdfBuffer = (data) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(24).fillColor("#1e40af")
      .text("Trip Registration Confirmation", { align: "center" });

    doc.moveDown(2);

    const rows = [
      ["Name", data.name],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Father Name", data.fatherName],
      ["Mother Name", data.motherName],
      ["Trip", data.trip],
    ];

    rows.forEach(([k, v]) => {
      doc.fontSize(14).fillColor("#000").text(`${k}: ${v}`);
      doc.moveDown(0.5);
    });

    doc.moveDown(2);
    doc.fillColor("#1e40af")
      .text("Thank you for registering. We will contact you soon.", {
        align: "center",
      });

    doc.end();
  });
};

// Controller
export const submitTripForm = async (req, res) => {
  try {
    const { name, email, phone, fatherName, motherName, trip } = req.body;

    if (!name || !email || !phone || !trip) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pdfBuffer = await generatePdfBuffer({
      name,
      email,
      phone,
      fatherName,
      motherName,
      trip,
    });

    // USER EMAIL
    await resend.emails.send({
      from: "Trip <onboarding@resend.dev>",
      to: email,
      subject: "✅ Trip Registration Successful",
      html: `
        <h2>Hello ${name},</h2>
        <p>Your trip registration is successful.</p>
        <p><strong>Trip:</strong> ${trip}</p>
        <p>📎 PDF attached</p>
      `,
      attachments: [
        {
          filename: "Trip-Confirmation.pdf",
          content: pdfBuffer.toString("base64"),
        },
      ],
    });

    // ADMIN EMAIL
    await resend.emails.send({
      from: "Trip <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New Trip Registration",
      html: `
        <h3>New Registration</h3>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Phone: ${phone}</li>
          <li>Trip: ${trip}</li>
        </ul>
      `,
      attachments: [
        {
          filename: "User-Details.pdf",
          content: pdfBuffer.toString("base64"),
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Email & PDF sent successfully",
    });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Email sending failed",
    });
  }
};
