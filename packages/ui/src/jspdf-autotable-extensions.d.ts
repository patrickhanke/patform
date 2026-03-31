import "jspdf";
import type { jsPDF as jspdfType } from "jspdf";
import type { UserOptions } from "jspdf-autotable";

declare module "jspdf" {
	interface jsPDF {
		jsPDF: jspdfType;
		autoTable: (options: UserOptions) => jsPDF;
		lastAutoTable?: {
			finalY: number;
			pageNumber: number;
			cursor?: { x: number; y: number };
			[key: string]: unknown;
		};
	}
}
