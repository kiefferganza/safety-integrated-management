import { Suspense, lazy, useEffect, useState } from "react";
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
import PDFRenderer from "./PDFRenderer";

const EmployeeListPage = lazy(() => import("./EmployeeListPage"));

const fetchInspectors = (filterDate, positions) =>
    axiosInstance
        .get(
            route("api.inspections.inspectors.employees", {
                filterDate,
                positions,
            })
        )
        .then((res) => res.data);

const index = ({ auth: { user }, registeredPositions = [] }) => {
    const [filterDate, setFilterDate] = useState(null);
    const [customDataPDF, setCustomDataPDF] = useState(null);
    const [dataPDF, setDataPDF] = useState([]);
    const [open, setOpen] = useState(false);

    const positionStrings = registeredPositions
        .map((p) => p.position_id)
        .join(",");

    const { isLoading, data } = useQuery({
        queryKey: [
            "inspectors",
            user.subscriber_id,
            filterDate,
            positionStrings,
        ],
        queryFn: () =>
            fetchInspectors(filterDate || new Date(), positionStrings),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!isLoading && data) {
            const d = data
                ?.filter((e) => e.inspections_count !== 0)
                ?.map((employee) => ({
                    ...employee,
                    id: employee.employee_id,
                    status: employee.is_active === 0 ? "active" : "inactive",
                    phone_no:
                        employee.phone_no == 0 ? "N/A" : employee.phone_no,
                }));
            setDataPDF(d || []);
        }
    }, [data, isLoading]);

    const openPDF = ({ data = null }) => {
        if (data !== null) {
            setCustomDataPDF(data);
        }
        setOpen(true);
    };

    const closePDF = () => {
        setOpen(false);
    };
    return (
        <>
            <Head>
                <title>Inspector: List</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <EmployeeListPage
                        employees={dataPDF}
                        isLoading={isLoading}
                        registeredPositions={registeredPositions}
                        openPDF={openPDF}
                        filterDate={filterDate}
                        setFilterDate={setFilterDate}
                    />
                </DashboardLayout>
            </Suspense>
            {!isLoading && (
                <PDFRenderer
                    dataPDF={customDataPDF || dataPDF}
                    open={open}
                    onClose={closePDF}
                    filterDate={filterDate}
                />
            )}
        </>
    );
};

export default index;
