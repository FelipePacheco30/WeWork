declare module "jspdf" {
  export default class jsPDF {
    constructor(options?: { orientation?: "portrait" | "landscape" | string });
    setFontSize(size: number): void;
    text(text: string, x: number, y: number): void;
    save(filename: string): void;
  }
}

declare module "jspdf-autotable" {
  import jsPDF from "jspdf";

  interface AutoTableOptions {
    startY?: number;
    head?: string[][];
    body?: Array<Array<string | number>>;
    styles?: {
      fontSize?: number;
      cellPadding?: number;
    };
    headStyles?: {
      fillColor?: number[];
    };
  }

  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}
