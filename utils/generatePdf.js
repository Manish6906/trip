import PDFDocument from "pdfkit";

export const generateTripPdf = (data) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.fontSize(20).text("Trip Registration Confirmation", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Name: ${data.name}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Phone: ${data.phone}`);
    doc.text(`Father Name: ${data.fatherName}`);
    doc.text(`Mother Name: ${data.motherName}`);
    doc.text(`Trip Selected: ${data.trip}`);

    doc.moveDown();
    doc.text("Thank you for registering!", { align: "center" });

    doc.end();
  });
};
