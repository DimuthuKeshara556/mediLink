import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "../../../assets/Images/logo.png";
import downloadIcon from "../../../assets/Icons/file_download.svg";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../Firebase/firebase";

const PdfComponent = ({ sessionId }) => {
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const treatmentRef = doc(firestore, "treatmentPlans", sessionId);
        const treatmentDoc = await getDoc(treatmentRef);
        if (treatmentDoc.exists()) {
          setTreatmentPlans(treatmentDoc.data().plans || []);
        } else {
          console.log("No such treatment document!");
        }

        const medicationRef = doc(firestore, "medications", sessionId);
        const medicationDoc = await getDoc(medicationRef);
        if (medicationDoc.exists()) {
          setMedications(medicationDoc.data().medications || []);
        } else {
          console.log("No such medication document!");
        }
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchData();
  }, [sessionId]);

  const title = "Medication for patient name";
  const generatePdf = () => {
    const doc = new jsPDF();
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    doc.addImage(logoUrl, "PNG", 10, 10, 30, 10);

    doc.setFontSize(9);
    doc.text(`Date: ${formattedDate}`, 10, 30);
    doc.text(`Time: ${formattedTime}`, 10, 40);

    doc.setFontSize(20);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 60, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.text(`Session Id: ${sessionId}`, 10, 100);

    doc.setFontSize(12);
    doc.text("Treatment Plans", 10, 120);
    doc.setFontSize(10);
    let yPosition = 130;
    if (treatmentPlans.length > 0) {
      treatmentPlans.forEach((plan, planIndex) => {
        doc.text(`${planIndex + 1}. ${plan.heading}`, 10, yPosition);
        yPosition += 10;
        autoTable(doc, {
          startY: yPosition,
          body: [[{ content: plan.content, styles: { cellWidth: "wrap" } }]],
          theme: "plain",
          styles: { fontSize: 9, textColor: [128, 128, 128] },
        });
        yPosition += 20;
      });
    } else {
      doc.text("No treatment plans found.", 20, yPosition);
    }

    yPosition += 20;
    doc.setFontSize(12);
    doc.text("Medications", 10, yPosition);
    yPosition += 5;
    if (medications.length > 0) {
      medications.forEach((medication, medicationIndex) => {
        doc.setFontSize(10);
        doc.setTextColor(0, 122, 255);
        yPosition += 0;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        autoTable(doc, {
          startY: yPosition,
          body: [
            [
              {
                content: `${medication.medicationName}`,
                styles: { cellWidth: "auto" },
              },
              {
                content: `${medication.dosage}`,
                styles: { cellWidth: "auto" },
              },
              {
                content: `×${medication.dosagePerHour}`,
                styles: { cellWidth: "auto" },
              },
              {
                content: `Every ${medication.dosagePerEveryHours} hours`,
                styles: { cellWidth: "auto" },
              },
              {
                content: `for ${medication.availableDaye} days`,
                styles: { cellWidth: "auto" },
              },
            ],
          ],
          theme: "plain",
          styles: { fontSize: 10 },
        });
        yPosition += 20;
      });
    } else {
      doc.text("No medications found.", 20, yPosition);
    }

    yPosition += 20;
    doc.setFontSize(10);
    doc.setTextColor(165, 42, 42);
    doc.text("Caution :", 10, yPosition);
    yPosition += 10;
    const cautionMessages = [
      "If you are a child, seek help from a parent or guardian before taking medication, and always follow",
      "the prescribed dosage, consulting a healthcare professional if needed.",
      "Take your medication exactly as prescribed, following the correct dosage and timing; consult",
      "your healthcare professional with any questions.",
    ];
    cautionMessages.forEach((msg, index) => {
      doc.text(msg, 10, yPosition + index * 10);
    });
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div>
      <img
        onClick={generatePdf}
        className="hover:scale-105"
        src={downloadIcon}
        alt="Generate PDF"
      />
    </div>
  );
};

export default PdfComponent;
