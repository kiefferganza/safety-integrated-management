import { Suspense, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import InspectionTrackerPage from "./InspectionTrackerPage";
import { fetchInspectionTracker } from "@/utils/axios";
import { getComparator, useTable } from "@/Components/table";
import PDFRenderer from "./PDF/PDFRenderer";

const MAX_ITEM = 40;

const index = ({ auth: { user } }) => {
    const { isLoading, data } = useQuery({
        queryKey: ["inspections.tracker", user.subscriber_id],
        queryFn: fetchInspectionTracker,
        refetchOnWindowFocus: false,
    });
    const [openPDF, setOpenPDF] = useState(false);

    const [filterName, setFilterName] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);

    const table = useTable({
        defaultOrderBy: "date_assigned",
        defaultOrder: "desc",
    });

    const [tableData, setTableData] = useState([]);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
        filterStatus,
        filterStartDate,
        filterEndDate,
    });

    useEffect(() => {
        if (!isLoading && data) {
            setTableData(data?.tracker ?? []);
        }
    }, [isLoading, data]);

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

    const PDFData = useMemo(() => {
        const data =
            table.selected.length > 0
                ? dataFiltered.filter((d) => table.selected.includes(d.id))
                : dataFiltered;

        const total = {};
        const dateTupple = [0, 0];
        const pdfData = [];
        if (data.length > 0) {
            let submitted = 0;
            let notSubmitted = 0;
            let summarySubmitted = 0;
            let summaryNotSubmitted = 0;

            dateTupple[0] = new Date(data[0].date_assigned).getTime();
            dateTupple[1] = new Date(data[0].date_assigned).getTime();

            for (let i = 0; i < data.length; i++) {
                const timestamps = new Date(data[i].date_assigned).getTime();

                if (timestamps < dateTupple[0]) {
                    dateTupple[0] = timestamps;
                }

                if (timestamps > dateTupple[1]) {
                    dateTupple[1] = timestamps;
                }
                for (let j = 0; j < data[i].tracker_employees.length; j++) {
                    const ass_id = data[i].tracker_employees[j].id;
                    const ass = data[i].tracker_employees[j];
                    const originator = data[i].fullname;
                    const originatorImg = data[i]?.img;
                    delete ass.id;
                    const newPdfData = {
                        ...data[i],
                        originatorImg,
                        ass_id,
                        originator,
                        ...ass,
                    };
                    delete newPdfData.tracker_employees;
                    pdfData.push(newPdfData);
                }
            }

            pdfData.forEach((dt, i) => {
                if (dt.status) {
                    submitted++;
                } else {
                    notSubmitted++;
                }
                if ((i + 1) % MAX_ITEM === 0 || i === pdfData.length - 1) {
                    total[i] = {
                        submitted,
                        notSubmitted,
                    };
                    summarySubmitted += submitted;
                    summaryNotSubmitted += notSubmitted;
                    submitted = 0;
                    notSubmitted = 0;
                }
            });

            const summary = {
                submitted: summarySubmitted,
                notSubmitted: summaryNotSubmitted,
            };

            return { total, summary, dateTupple, pdfData };
        }

        return { total, summary: {}, dateTupple: [], pdfData: [] };
    }, [dataFiltered]);

    console.log(PDFData);

    return (
        <>
            <Head>
                <title>Inspection Tracker</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <InspectionTrackerPage
                        employees={data?.employees ?? []}
                        data={data?.tracker}
                        projectDetails={data?.projectDetails ?? {}}
                        sequenceNo={data?.sequenceNo ?? "000001"}
                        isLoading={isLoading}
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
                        tableData={tableData}
                        setTableData={setTableData}
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
            (pre) => new Date(pre.date_assigned) >= filterStartDate
        );
    }

    if (filterStartDate && filterEndDate) {
        inputData = inputData.filter((pre) => {
            const date = new Date(pre.date_assigned);
            return date >= filterStartDate && date <= filterEndDate;
        });
    }

    return inputData;
}

export default index;
