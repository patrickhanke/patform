import 'jspdf';
import type { jsPDF as jspdfType } from 'jspdf';
import type { UserOptions } from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
	jsPDF: jspdfType;
    /**
     * Adds a table to the PDF document using jspdf-autotable.
     * @param options Table configuration options
     */
    autoTable: (options: UserOptions) => jsPDF;

    /**
     * Stores metadata about the last rendered table.
     */
    lastAutoTable?: {
      finalY: number;
      pageNumber: number;
      cursor?: { x: number; y: number };
      [key: string]: any;
    };
  }
}
