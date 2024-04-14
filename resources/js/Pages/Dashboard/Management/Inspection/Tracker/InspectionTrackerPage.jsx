import { useCallback, useState } from "react";
// @mui
const {
    Card,
    Table,
    Button,
    Divider,
    Tabs,
    Tab,
    TableBody,
    Container,
    TableContainer,
    Stack,
    Tooltip,
    IconButton,
} = await import("@mui/material");
// routes
import { PATH_DASHBOARD } from "@/routes/paths";
// components
import ConfirmDialog from "@/Components/confirm-dialog";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
import Iconify from "@/Components/iconify";
import Scrollbar from "@/Components/scrollbar";
import { useSettingsContext } from "@/Components/settings";
import {
    TableEmptyRows,
    TableHeadCustom,
    TableNoData,
    TablePaginationCustom,
    TableSelectedAction,
    TableSkeleton,
    emptyRows,
    getComparator,
    useTable,
} from "@/Components/table";
// sections
import { useSwal } from "@/hooks/useSwal";
import { Inertia } from "@inertiajs/inertia";
import { useQueryClient } from "@tanstack/react-query";
import Label from "@/Components/label/Label";
import {
    InspectionTrackerRow,
    InspectionTrackerToolbar,
} from "@/sections/@dashboard/inspection/tracker";
import RegisterEmployeePortal from "@/sections/@dashboard/inspection/tracker/portal/RegisterEmployeePortal";

const TABLE_HEAD = [
    { id: "form_number", label: "CMS Number", align: "left" },
    { id: "fullname", label: "Originator", align: "left" },
    { id: "position", label: "Position", align: "left" },
    { id: "date_issued", label: "Date" },
    { id: "status", label: "Status", align: "left" },
    { id: "employees", label: "Created", align: "left" },
    { id: "" },
];

// --------------------------------

export default function InspectionTrackerPage({
    isLoading,
    employees,
    data = [],
    projectDetails,
    sequenceNo,
    dataFiltered = [],
    handleFilterName,
    handleFilterStatus,
    handleFilterStartDate,
    handleFilterEndDate,
    handleResetFilter,
    filters,
    table,
    openPDF,
    setTableData,
    tableData,
}) {
    const { load, stop } = useSwal();
    const { themeStretch } = useSettingsContext();

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState(null);

    const { filterName, filterStatus, filterStartDate, filterEndDate } =
        filters;

    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        //
        selected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = table;

    const denseHeight = dense ? 56 : 76;

    const isFiltered =
        filterName !== "" ||
        !!filterStartDate ||
        !!filterEndDate ||
        filterStatus !== "all";

    const isNotFound = !dataFiltered.length && !!isFiltered;

    const getLengthByStatus = (status) =>
        dataFiltered.filter((item) => item.status === status).length;

    const TABS = [
        {
            value: "all",
            label: "All",
            color: "info",
            count: dataFiltered.length,
        },
        {
            value: "completed",
            label: "Completed",
            color: "success",
            count: getLengthByStatus(true),
        },
        {
            value: "pending",
            label: "Pending",
            color: "warning",
            count: getLengthByStatus(false),
        },
    ];

    const handleOpenRegister = () => {
        setOpenRegister(true);
    };

    const handleCloseRegister = () => {
        setOpenRegister(false);
    };

    const handleOpenEdit = (data) => {
        setSelectedEdit(data);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setSelectedEdit(null);
    };

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleDeleteRow = useCallback((id) => () => {
        const tmpData = [...tableData];
        // Inertia.post(
        //     route("toolboxtalk.management.preplanning.deleteAssignEmployee"),
        //     { ids: [id] },
        //     {
        //         onStart() {
        //             load("Deleting assigned employee's", "Please wait...");
        //             setTableData((data) => data.filter((d) => d.id !== id));
        //         },
        //         onError() {
        //             setTableData(tmpData);
        //         },
        //         onFinish() {
        //             setPage(0);
        //             stop();
        //         },
        //     }
        // );
    });

    const handleDeleteRows = (ids = []) => {
        const tmpData = [...tableData];
        // Inertia.post(
        //     route("toolboxtalk.management.preplanning.deleteAssignEmployee"),
        //     { ids },
        //     {
        //         onStart() {
        //             load("Deleting assigned employee's", "Please wait...");
        //             setTableData((data) =>
        //                 data.filter((d) => !ids.includes(d.id))
        //             );
        //         },
        //         onError() {
        //             setTableData(tmpData);
        //         },
        //         onFinish() {
        //             setPage(0);
        //             setSelected([]);
        //             stop();
        //         },
        //     }
        // );
    };

    return (
        <>
            <Container maxWidth={themeStretch ? false : "lg"}>
                <CustomBreadcrumbs
                    sx={{
                        "&>div": {
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                        },
                    }}
                    heading="Inspection Tracker"
                    links={[
                        {
                            name: "Dashboard",
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: "Inspections List",
                            href: PATH_DASHBOARD.inspection.list,
                        },
                        {
                            name: "List",
                        },
                    ]}
                    action={
                        <Stack direction="row" flexWrap="wrap" gap={1.5}>
                            <Button
                                onClick={handleOpenRegister}
                                variant="contained"
                                startIcon={<Iconify icon="eva:plus-fill" />}
                                disabled={isLoading}
                            >
                                Create
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Iconify icon="eva:eye-fill" />}
                                disabled={isLoading}
                                onClick={openPDF}
                            >
                                View PDF
                            </Button>
                        </Stack>
                    }
                />
                <Card>
                    <Tabs
                        value={filterStatus}
                        onChange={handleFilterStatus}
                        sx={{
                            px: 2,
                            bgcolor: "background.neutral",
                        }}
                    >
                        {TABS.map((tab) => (
                            <Tab
                                key={tab.value}
                                value={tab.value}
                                label={tab.label}
                                icon={
                                    <Label color={tab.color} sx={{ mr: 1 }}>
                                        {tab.count}
                                    </Label>
                                }
                            />
                        ))}
                    </Tabs>

                    <Divider />

                    <InspectionTrackerToolbar
                        isFiltered={isFiltered}
                        filterName={filterName}
                        filterStartDate={filterStartDate}
                        filterEndDate={filterEndDate}
                        onFilterName={handleFilterName}
                        onFilterStartDate={handleFilterStartDate}
                        onFilterEndDate={handleFilterEndDate}
                        onResetFilter={handleResetFilter}
                    />

                    <TableContainer
                        sx={{ position: "relative", overflow: "unset" }}
                    >
                        <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={dataFiltered.length}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    dataFiltered.map((row) => row.id)
                                )
                            }
                            action={
                                <Stack direction="row" gap={1}>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="primary"
                                            onClick={handleOpenConfirm}
                                        >
                                            <Iconify icon="eva:trash-2-outline" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="View PDF">
                                        <IconButton
                                            color="primary"
                                            onClick={openPDF}
                                        >
                                            <Iconify icon="eva:eye-fill" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            }
                        />
                        <Scrollbar>
                            <Table
                                size={dense ? "small" : "medium"}
                                sx={{ minWidth: 800 }}
                            >
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData.length}
                                    numSelected={selected.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            dataFiltered
                                                .slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage +
                                                        rowsPerPage
                                                )
                                                .map((row) => row.id)
                                        )
                                    }
                                    sx={{
                                        "&>tr th": { whiteSpace: "nowrap" },
                                    }}
                                />

                                <TableBody>
                                    {isLoading ? (
                                        [...Array(rowsPerPage)].map(
                                            (_i, index) => (
                                                <TableSkeleton
                                                    key={index}
                                                    sx={{ height: denseHeight }}
                                                />
                                            )
                                        )
                                    ) : tableData.length > 0 ? (
                                        dataFiltered
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                            .map((row) => (
                                                <InspectionTrackerRow
                                                    key={row.id}
                                                    row={row}
                                                    selected={selected.includes(
                                                        row.id
                                                    )}
                                                    onSelectRow={() =>
                                                        onSelectRow(row.id)
                                                    }
                                                    onDeleteRow={handleDeleteRow(
                                                        row.id
                                                    )}
                                                    onEdit={handleOpenEdit}
                                                />
                                            ))
                                    ) : (
                                        <TableNoData isNotFound={true} />
                                    )}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(
                                            page,
                                            rowsPerPage,
                                            tableData.length
                                        )}
                                    />

                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                    <TablePaginationCustom
                        count={dataFiltered.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        //
                        dense={dense}
                        onChangeDense={onChangeDense}
                    />
                </Card>
            </Container>

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete{" "}
                        <strong> {selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleCloseConfirm();
                            handleDeleteRows(selected);
                        }}
                    >
                        Delete
                    </Button>
                }
            />

            <RegisterEmployeePortal
                open={openRegister}
                onClose={handleCloseRegister}
                employeeList={employees}
                projectDetails={projectDetails}
                sequenceNo={sequenceNo}
            />

            <RegisterEmployeePortal
                title="Edit Assigned Employee"
                open={openEdit}
                onClose={handleCloseEdit}
                employeeList={employees}
                projectDetails={projectDetails}
                currentRegistered={selectedEdit}
                isEdit
            />
        </>
    );
}
