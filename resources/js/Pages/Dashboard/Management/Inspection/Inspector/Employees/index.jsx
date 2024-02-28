import { Suspense, lazy, useState } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { Head } from "@inertiajs/inertia-react";
import Iconify from "@/Components/iconify";
import { useRenderPDF } from "@/hooks/useRenderPDF";
// MUI
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

const EmployeeListPage = lazy(() => import("./EmployeeListPage"));

const fetchInspectors = () =>
    axiosInstance
        .get(route("api.inspections.inspectors.employees"))
        .then((res) => res.data);

const index = ({ auth: { user }, registeredPositions }) => {
    const { isLoading, data } = useQuery({
        queryKey: ["inspectors", user.subscriber_id],
        queryFn: fetchInspectors,
        refetchOnWindowFocus: false,
    });

    const [dataPDF, setDataPDF] = useState([]);
    const [open, setOpen] = useState(false);

    const { url, loading, error } = useRenderPDF({
        pdf_type: "inspectors_view",
        dataPDF,
    });
    const src = url ? `${url}#toolbar=1` : null;

    const openPDF = (data) => {
        setDataPDF(data);
        setOpen(true);
    };

    const closePDF = () => {
        setOpen(false);
        setDataPDF([]);
    };

    if (error) {
        console.log({ error });
        return (
            <div>
                <h3>Something went wrong!</h3>
                {/* {JSON.stringify(error)} */}
            </div>
        );
    }
    console.log(dataPDF);
    return (
        <>
            <Head>
                <title>Inspector: List</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <EmployeeListPage
                        employees={data}
                        isLoading={isLoading}
                        registeredPositions={registeredPositions}
                        openPDF={openPDF}
                    />
                </DashboardLayout>
            </Suspense>
            <Dialog fullScreen open={open}>
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <DialogActions
                        sx={{
                            zIndex: 9,
                            padding: "12px !important",
                            boxShadow: (theme) => theme.customShadows.z8,
                        }}
                    >
                        <Tooltip title="Close">
                            <IconButton color="inherit" onClick={closePDF}>
                                <Iconify icon="eva:close-fill" />
                            </IconButton>
                        </Tooltip>
                    </DialogActions>

                    <Box
                        sx={{ flexGrow: 1, height: "100%", overflow: "hidden" }}
                    >
                        {loading ? (
                            <IconButton>
                                <CircularProgress size={18} color="inherit" />
                            </IconButton>
                        ) : (
                            <iframe
                                src={src}
                                style={{ height: "100%", width: "100%" }}
                            />
                        )}
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

export default index;
