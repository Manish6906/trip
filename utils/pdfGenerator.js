import PDFDocument from "pdfkit";

export const generatePdfBuffer = (data) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // 🎨 Background Header
    doc
      .rect(0, 0, doc.page.width, 100)
      .fill("#2980b9"); // Blue header
    doc.fillColor("white").fontSize(26).text("🏔 Trip Registration", 50, 35);

    doc.moveDown(3);

    // Subtitle
    doc
      .fillColor("#2c3e50")
      .fontSize(16)
      .text("Registration Confirmation", { align: "center" });
    doc.moveDown(2);

    // Info Box
    const startX = 50;
    let startY = 150;
    const boxHeight = 30;

    const fields = [
      { label: "Name", value: data.Name },
      { label: "Email", value: data.Email },
      { label: "Phone", value: data.Phone },
      { label: "Father Name", value: data.Father },
      { label: "Mother Name", value: data.Mother },
      { label: "Trip Selected", value: data.Trip },
     { label: "Trip Date", value: data.Date || "N/A" }


    ];

    fields.forEach((field, i) => {
      // Alternate row colors
      doc
        .rect(startX, startY, doc.page.width - 100, boxHeight)
        .fill(i % 2 === 0 ? "#ecf0f1" : "#ffffff");

      // Text
      doc
        .fillColor("#2c3e50")
        .fontSize(14)
        .text(`${field.label}:`, startX + 10, startY + 8, { continued: true })
        .fillColor("#2980b9")
        .text(` ${field.value}`);

      startY += boxHeight + 5;
    });

    doc.moveDown(2);

    // Footer
    doc
      .fontSize(12)
      .fillColor("#7f8c8d")
      .text(
        "Thank you for registering! We look forward to seeing you on the trip.",
        50,
        startY + 20,
        { align: "center" }
      );

    doc.end();
  });
};
