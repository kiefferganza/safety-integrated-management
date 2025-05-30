import { createElement } from "react";

export const renderPDF = async (props) => {
    const { pdf } = await import("@react-pdf/renderer");
    let PDF_IMPORT = null;
    switch (props.pdf_type) {
        // DETAILS
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
        case "tbt_tracker":
            PDF_IMPORT = await import(
                "@/Pages/Dashboard/Management/ToolboxTalk/Preplanning/PDF/PDF"
            );
            break;
        case "inspection_tracker":
            PDF_IMPORT = await import(
                "@/Pages/Dashboard/Management/Inspection/Tracker/PDF/PDF"
            );
            break;
        case "training_tracker":
            PDF_IMPORT = await import(
                "@/Pages/Dashboard/Management/Training/Tracker/PDF/PDF"
            );
            break;
        case "ppe_view":
            PDF_IMPORT = await import(
                "@/Pages/Dashboard/Management/PPE/Detail/PDF/PDF"
            );
            break;
        // LISTS
        case "employee_list":
            PDF_IMPORT = await import(
                "@/Pages/Dashboard/Management/Employee/List/PDF/PDF"
            );
            break;
        case "ppe_list":
            PDF_IMPORT = await import(
                "@/Pages/Dashboard/Management/PPE/List/PDF/PDF"
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
