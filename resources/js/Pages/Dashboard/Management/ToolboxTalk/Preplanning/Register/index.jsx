import { Suspense, lazy, useState } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import { fetchPreplanning } from "@/utils/axios";
import { getComparator, useTable } from "@/Components/table";
import PDFRenderer from "../PDF/PDFRenderer";
const RegisterPage = lazy(() => import("./RegisterPage"));

const index = ({ auth: { user } }) => {
    const { isLoading, data } = useQuery({
        queryKey: ["toolboxtalks.preplanning.tbtDailies", user.subscriber_id],
        queryFn: fetchPreplanning,
        refetchOnWindowFocus: false,
    });

    const [openPDF, setOpenPDF] = useState(false);

    const [filterName, setFilterName] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);

    const table = useTable();

    const dataFiltered = applyFilter({
        inputData: data?.preplanning || [],
        comparator: getComparator(table.order, table.orderBy),
        filterName,
        filterStatus,
        filterStartDate,
        filterEndDate,
    });

    const handleFilterName = (event) => {
        table.setPage(0);
        setFilterName(event.target.value);
    };

    const handleFilterStatus = (_, newValue) => {
        table.setPage(0);
        setFilterStatus(newValue);
    };

    const handleFilterStartDate = (value) => {
        table.setPage(0);
        setFilterStartDate(value.setHours(0, 0, 0, 0));
    };

    const handleFilterEndDate = (value) => {
        table.setPage(0);
        setFilterEndDate(value.setHours(11, 59, 59, 59));
    };

    const handleResetFilter = () => {
        setFilterName("");
        setFilterStartDate(null);
        setFilterEndDate(null);
        setFilterStatus("all");
        table.setPage(0);
    };

    const handleOpenPDF = () => {
        setOpenPDF(true);
    };

    const handleClosePDF = () => {
        setOpenPDF(false);
    };

    const PDFData =
        table.selected.length > 0
            ? dataFiltered.filter((d) => table.selected.includes(d.id))
            : dataFiltered;

    return (
        <>
            <Head>
                <title>TBT Tracker</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <RegisterPage
                        isLoading={isLoading}
                        employees={data?.employees ?? []}
                        preplanning={data?.preplanning ?? []}
                        projectDetails={data?.projectDetails ?? {}}
                        sequenceNo={data?.sequenceNo ?? "000001"}
                        user={user}
                        table={table}
                        filters={{
                            filterName,
                            filterStatus,
                            filterStartDate,
                            filterEndDate,
                        }}
                        dataFiltered={dataFiltered}
                        handleFilterName={handleFilterName}
                        handleFilterStatus={handleFilterStatus}
                        handleFilterStartDate={handleFilterStartDate}
                        handleFilterEndDate={handleFilterEndDate}
                        handleResetFilter={handleResetFilter}
                        openPDF={handleOpenPDF}
                    />
                </DashboardLayout>
            </Suspense>
            {!isLoading && (
                <PDFRenderer
                    dataPDF={PDFData}
                    open={openPDF}
                    onClose={handleClosePDF}
                />
            )}
        </>
    );
};

function applyFilter({
    inputData,
    comparator,
    filterName,
    filterStatus,
    filterStartDate,
    filterEndDate,
}) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        inputData = inputData.filter(({ fullname }) =>
            fullname.toLowerCase().includes(filterName.toLowerCase())
        );
    }

    if (filterStatus !== "all") {
        const status = filterStatus === "completed";
        inputData = inputData.filter((pre) => pre.status === status);
    }

    if (filterStartDate && !filterEndDate) {
        inputData = inputData.filter(
            (pre) => new Date(pre.date_issued) >= filterStartDate
        );
    }

    if (filterStartDate && filterEndDate) {
        inputData = inputData.filter((pre) => {
            const date = new Date(pre.date_issued);
            return date >= filterStartDate && date <= filterEndDate;
        });
    }

    return inputData;
}

export default index;
