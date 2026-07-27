import PDFDocument from "pdfkit";

export const generateHealthPDF = (data, res) => {
    const doc = new PDFDocument({
        margin: 40,
        size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${data.pet.name}-Health-Report.pdf`
    );

    doc.pipe(res);

    // Title
    doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("Pet Health Report", {
            align: "center",
        });

    doc.moveDown();

    // Pet Information
    doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("Pet Information");

    doc.moveDown(0.5);

    doc.fontSize(12);

    doc.font("Helvetica-Bold").text("Name: ", { continued: true });
    doc.font("Helvetica").text(data.pet.name);

    doc.font("Helvetica-Bold").text("Breed: ", { continued: true });
    doc.font("Helvetica").text(data.pet.breed);

    doc.font("Helvetica-Bold").text("Age: ", { continued: true });
    doc.font("Helvetica").text(`${data.pet.age}`);

    doc.font("Helvetica-Bold").text("Weight: ", { continued: true });
    doc.font("Helvetica").text(`${data.pet.weight} kg`);

    doc.moveDown();

    doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("AI Health Summary");

doc.moveDown();

doc.font("Helvetica-Bold")
    .fontSize(14)
    .text("Disclaimer");

doc.font("Helvetica")
    .fontSize(12)
    .text(data.aiSummary.disclaimer);

doc.moveDown();

doc.font("Helvetica-Bold")
    .fontSize(14)
    .text("Overall Health Summary");

doc.font("Helvetica")
    .fontSize(12)
    .text(data.aiSummary.overallHealthSummary);

doc.moveDown();

doc.font("Helvetica-Bold")
    .fontSize(14)
    .text("Current Health Condition");

doc.font("Helvetica")
    .fontSize(12)
    .text(data.aiSummary.currentHealthCondition);

doc.moveDown();

doc.font("Helvetica-Bold")
    .fontSize(14)
    .text("Potential Health Risks");

doc.font("Helvetica")
    .fontSize(12)
    .text(data.aiSummary.potentialHealthRisks);

doc.moveDown();

doc.font("Helvetica-Bold")
    .fontSize(14)
    .text("Recommendations");

doc.font("Helvetica")
    .fontSize(12)
    .text(data.aiSummary.recommendations);

doc.moveDown();

doc.font("Helvetica-Bold")
    .fontSize(14)
    .text("Preventive Care Tips");

doc.font("Helvetica")
    .fontSize(12)
    .text(data.aiSummary.preventiveCareTips);
    
    doc.end();
};