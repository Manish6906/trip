import PDFDocument from "pdfkit";
import { resend } from "../config/mailer.js";

// PDF Generator
const generatePdfBuffer = (data) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(22).text("Trip Registration Confirmation", { align: "center" });
    doc.moveDown(2);

    Object.entries(data).forEach(([k, v]) => {
      doc.fontSize(14).text(`${k}: ${v}`);
      doc.moveDown(0.5);
    });

    doc.end();
  });
};

export const submitTripForm = async (req, res) => {
  try {
    const { name, email, phone, fatherName, motherName, trip } = req.body;

    if (!name || !email || !phone || !trip) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pdfBuffer = await generatePdfBuffer({
      Name: name,
      Email: email,
      Phone: phone,
      Father: fatherName,
      Mother: motherName,
      Trip: trip,
    });

    // ✅ USER EMAIL (FIXED)
    await resend.emails.send({
      from: "Trip Registration <onboarding@resend.dev>", // ✅ MUST
      to: email,
      subject: "✅ Trip Registration Successful",
      html: `
        <h2>Hello ${name},</h2>
        <p>Your trip registration is confirmed.</p>
        <p><b>Trip Selected:</b> ${trip}</p>
        <p>PDF attached below 📎</p>
      `,
      attachments: [
        {
          filename: "Trip-Confirmation.pdf",
          content: pdfBuffer.toString("base64"),
        },
      ],
    });

    // ✅ ADMIN EMAIL
    await resend.emails.send({
      from: "Trip Admin <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New Trip Registration",
      html: `
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Phone: ${phone}</li>
          <li>Trip: ${trip}</li>
        </ul>
      `,
    });

    res.status(200).json({
      success: true,
      message: "User & Admin emails sent successfully",
    });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Email sending failed" });
  }
};
