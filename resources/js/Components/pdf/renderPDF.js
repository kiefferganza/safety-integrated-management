import { createElement } from "react";

export const renderPDF = async (props) => {
    const { pdf } = await import("@react-pdf/renderer");
    let PDF_IMPORT = null;
    switch (props.pdf_type) {
        case "inspection_view":
            PDF_IMPORT = await import(
                "@/sections/@dashboard/inspection/details/PDF"
            );
            break;
        case "inspectors_view":
            PDF_IMPORT = await import(
                "@/sections/@dashboard/inspection/inspectors/PDF/PDF"
            );
            break;
        default:
            PDF_IMPORT = await import(
                "@/sections/@dashboard/inspection/details/PDF"
            );
            break;
    }
    return pdf(createElement(PDF_IMPORT.PDF, { ...props })).toBlob();
};
