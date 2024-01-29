import { Suspense, lazy, useState } from "react";
import { Head } from "@inertiajs/inertia-react";
import Box from "@mui/material/Box";
import LoadingScreen from "@/Components/loading-screen";
// import RenderedPDFViewer from "./RenderPDFViewer";
// import PDF from "./PDF";
const PDF = lazy(() => import("./PDF"));

const index = ({ inspections }) => {
    const [isRendered, setIsRendered] = useState(false);
    return (
        <>
            <Head>
                <title>Inspection Report PDF</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <Box height="100%" minHeight="100vh">
                    {!isRendered && <LoadingScreen />}
                    <PDF
                        title="HSE Inspection Tracker"
                        inspections={inspections}
                        rendered={() => {
                            setIsRendered(true);
                        }}
                    />
                    {/* <RenderedPDFViewer
                        title="HSE Inspection Tracker"
                        style={{ minHeight: "100vh", width: "100%" }}
                        props={{ inspections }}
                    /> */}
                </Box>
            </Suspense>
        </>
    );
};

export default index;
