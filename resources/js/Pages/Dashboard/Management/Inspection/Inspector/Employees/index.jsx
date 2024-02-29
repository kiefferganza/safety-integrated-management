import { Suspense, lazy, useEffect, useState } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { Head } from "@inertiajs/inertia-react";
// MUI
import PDFRenderer from "./PDFRenderer";

const EmployeeListPage = lazy(() => import("./EmployeeListPage"));

const fetchInspectors = (filterDate, authorizedPositions) =>
    axiosInstance
        .get(
            route("api.inspections.inspectors.employees", {
                filterDate,
                authorizedPositions,
            })
        )
        .then((res) => res.data);

const index = ({ auth: { user }, authorizedPositions }) => {
    const [filterDate, setFilterDate] = useState(null);
    const [customDataPDF, setCustomDataPDF] = useState([]);
    const [dataPDF, setDataPDF] = useState([]);
    const [open, setOpen] = useState(false);

    const dateString = filterDate ? filterDate.join(",") : "";

    const { isLoading, data } = useQuery({
        queryKey: ["inspectors", user.subscriber_id, dateString],
        queryFn: () =>
            fetchInspectors(
                dateString,
                (authorizedPositions || []).map((a) => a.position_id).join(",")
            ),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!isLoading && data) {
            const d = data?.map((employee) => ({
                ...employee,
                id: employee.employee_id,
                status: employee.is_active === 0 ? "active" : "inactive",
                phone_no: employee.phone_no == 0 ? "N/A" : employee.phone_no,
            }));
            setDataPDF(d || []);
        }
    }, [data, isLoading]);

    const openPDF = ({ data = null }) => {
        if (data !== null) {
            setCustomDataPDF(data);
        } else {
            setCustomDataPDF(dataPDF);
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
                        filterDate={filterDate}
                        setFilterDate={setFilterDate}
                        openPDF={openPDF}
                    />
                </DashboardLayout>
            </Suspense>
            {!isLoading && (
                <PDFRenderer
                    dataPDF={customDataPDF}
                    open={open}
                    onClose={closePDF}
                    filterDate={filterDate}
                />
            )}
        </>
    );
};

export default index;
