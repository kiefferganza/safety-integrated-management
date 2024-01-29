import { Head } from "@inertiajs/inertia-react";
import Box from "@mui/material/Box";
import RenderedPDFViewer from "./RenderPDFViewer";

const index = ({ inspections }) => {
    return (
        <>
            <Head>
                <title>Inspection Report PDF</title>
            </Head>
            <Box height="100%" minHeight="100vh">
                <RenderedPDFViewer
                    title="HSE Inspection Tracker"
                    style={{ minHeight: "100vh", width: "100%" }}
                    props={{ inspections }}
                />
            </Box>
        </>
    );
};

export default index;
