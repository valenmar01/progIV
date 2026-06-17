import PDFDocument from 'pdfkit';

const escribirPagina = (doc, { nombres, apellido, documento, nombreCurso, cantidadHoras }) => {
    const fecha = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    const { width } = doc.page;

    doc.font('Helvetica-Bold').fontSize(20)
        .text('FACULTAD DE CIENCIAS DE LA ADMINISTRACIÓN', 0, 70, { align: 'center', width });
    doc.font('Helvetica').fontSize(13)
        .text('Universidad Nacional de Entre Ríos', { align: 'center', width });

    doc.moveDown(0.8);
    doc.moveTo(80, doc.y).lineTo(width - 80, doc.y).lineWidth(1).stroke();
    doc.moveDown(1.5);

    doc.font('Helvetica-Bold').fontSize(42)
        .text('DIPLOMA', { align: 'center', width });
    doc.moveDown(1.2);

    doc.font('Helvetica').fontSize(14)
        .text('Se certifica que', { align: 'center', width });
    doc.moveDown(0.6);

    doc.font('Helvetica-Bold').fontSize(26)
        .text(`${nombres} ${apellido}`, { align: 'center', width });
    doc.font('Helvetica').fontSize(12)
        .text(`DNI: ${documento}`, { align: 'center', width });
    doc.moveDown(0.8);

    doc.fontSize(14)
        .text('ha participado satisfactoriamente del curso', { align: 'center', width });
    doc.moveDown(0.6);

    doc.font('Helvetica-Bold').fontSize(22)
        .text(nombreCurso, { align: 'center', width });
    doc.font('Helvetica').fontSize(13)
        .text(`${cantidadHoras} horas de duración`, { align: 'center', width });

    doc.moveDown(2);
    doc.moveTo(80, doc.y).lineTo(width - 80, doc.y).lineWidth(1).stroke();
    doc.moveDown(0.6);
    doc.font('Helvetica').fontSize(11)
        .text(`Concordía - Entre Ríos, ${fecha}`, { align: 'center', width });
};

export const generarDiplomaIndividual = (res, datos) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="diploma-${datos.documento}.pdf"`);
    doc.pipe(res);
    escribirPagina(doc, datos);
    doc.end();
};
