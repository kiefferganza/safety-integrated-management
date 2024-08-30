import { Suspense, lazy, useEffect, useState } from "react";
import { Head } from "@inertiajs/inertia-react";
import Box from "@mui/material/Box";
import LoadingScreen from "@/Components/loading-screen";
const PDF = lazy(() => import("./PDF"));

const index = ({ inspections, info }) => {
    const [isRendered, setIsRendered] = useState(false);
    useEffect(() => {
        document.body.style.overflow = "hidden";
    }, []);
    return (
        <>
            <Head>
                <title>Inspection Closedout Tracker Report</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <Box height="100vh" overflow="clip">
                    {!isRendered && <LoadingScreen />}
                    <PDF
                        title="Inspection Closedout Tracker Report"
                        inspections={inspections}
                        info={info}
                        rendered={() => {
                            setIsRendered(true);
                        }}
                    />
                </Box>
            </Suspense>
        </>
    );
};

export default index;
