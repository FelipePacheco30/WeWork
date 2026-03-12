import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { Professional } from "@/types/professional";

function formatDate(dateValue: string) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("pt-BR");
}

export function exportProfessionalsPdf(items: Professional[]) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text("WeWork - Exportacao de Profissionais", 14, 16);

  autoTable(doc, {
    startY: 24,
    head: [["Nome", "Cargo", "Departamento", "Email", "Data inicio", "Venc. contrato", "Status"]],
    body: items.map((item) => [
      item.nome,
      item.cargo,
      item.departamento,
      item.email,
      formatDate(item.data_inicio),
      formatDate(item.data_vencimento_contrato),
      item.status,
    ]),
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [0, 90, 205] },
  });

  doc.save("profissionais-wework.pdf");
}
