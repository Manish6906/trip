import { resend } from "../config/mailer.js";
import { generatePdfBuffer } from "../utils/pdfGenerator.js";

export const submitTripForm = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      fatherName,
      motherName,
      trip,
      tripDate, // ✅ DATE
    } = req.body;

    if (!name || !email || !phone || !trip || !tripDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Format date (YYYY-MM-DD → DD Mon YYYY)
    const formattedDate = new Date(tripDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Generate attractive PDF
    const pdfBuffer = await generatePdfBuffer({
      Name: name,
      Email: email,
      Phone: phone,
      Father: fatherName,
      Mother: motherName,
      Trip: trip,
      Date: tripDate, // ✅ DATE IN PDF
    });

    console.log("Sending admin email...");

    // ADMIN EMAIL
    await resend.emails.send({
      from: "Trip Admin <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New Trip Registration Submitted",
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:auto;padding:20px;background:#f9f9f9;border-radius:15px;border:1px solid #e0e0e0;">
          
          <h1 style="color:#2c3e50;text-align:center;font-size:24px;">
            🏔 New Trip Registration
          </h1>

          <table style="width:100%;border-collapse:collapse;margin-top:20px;">
            <tr style="background:#3498db;color:white;">
              <th style="padding:10px;text-align:left;">Field</th>
              <th style="padding:10px;text-align:left;">Value</th>
            </tr>

            <tr>
              <td style="padding:10px;font-weight:bold;">Name</td>
              <td style="padding:10px;">${name}</td>
            </tr>

            <tr style="background:#ecf0f1;">
              <td style="padding:10px;font-weight:bold;">Email</td>
              <td style="padding:10px;">${email}</td>
            </tr>

            <tr>
              <td style="padding:10px;font-weight:bold;">Phone</td>
              <td style="padding:10px;">${phone}</td>
            </tr>

            <tr style="background:#ecf0f1;">
              <td style="padding:10px;font-weight:bold;">Father</td>
              <td style="padding:10px;">${fatherName}</td>
            </tr>

            <tr>
              <td style="padding:10px;font-weight:bold;">Mother</td>
              <td style="padding:10px;">${motherName}</td>
            </tr>

            <tr style="background:#ecf0f1;">
              <td style="padding:10px;font-weight:bold;">Trip</td>
              <td style="padding:10px;color:#27ae60;font-weight:bold;">${trip}</td>
            </tr>

            <tr>
              <td style="padding:10px;font-weight:bold;">Trip Date</td>
              <td style="padding:10px;color:#e67e22;font-weight:bold;">
                ${formattedDate}
              </td>
            </tr>
          </table>

          <p style="text-align:center;margin-top:20px;color:#7f8c8d;">
            📎 Trip details PDF attached
          </p>

          <footer style="text-align:center;font-size:12px;color:#95a5a6;margin-top:20px;">
            © 2025 Trip Registration Portal
          </footer>
        </div>
      `,
      attachments: [
        {
          filename: "Trip-Details.pdf",
          type: "application/pdf",
          content: pdfBuffer.toString("base64"),
          disposition: "attachment",
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Admin email sent successfully",
    });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Email sending failed", error });
  }
};
