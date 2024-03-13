import { useState } from "react";
// @mui
const {
    Card,
    Table,
    Button,
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
import { PreplanningRegisterTableRow } from "@/sections/@dashboard/toolboxtalks/preplanning/register";
import RegisterEmployeePortal from "@/sections/@dashboard/toolboxtalks/preplanning/register/portal/RegisterEmployeePortal";
import { Inertia } from "@inertiajs/inertia";
import { useQueryClient } from "@tanstack/react-query";

const TABLE_HEAD = [
    { id: "fullname", label: "Created By", align: "left" },
    { id: "position", label: "Position", align: "left" },
    { id: "location", label: "Location", align: "left" },
    { id: "date_issued", label: "Date" },
    { id: "status", label: "TBT Status", align: "left" },
    { id: "employees", label: "Total Attnd.", align: "left" },
    { id: "" },
];

// --------------------------------

export default function RegisterPage({
    isLoading,
    employees,
    preplanning,
    locations,
    user,
}) {
    const queryClient = useQueryClient();
    const { load, stop } = useSwal();
    const { themeStretch } = useSettingsContext();

    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        // setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable();

    // const [tableData, setTableData] = useState([]);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState(null);

    const dataFiltered = applyFilter({
        inputData: preplanning,
        comparator: getComparator(order, orderBy),
    });

    const denseHeight = dense ? 56 : 76;

    // const isFiltered = filterName !== '' || !!filterDate;

    // const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterDate);

    // const isFiltered = false;
    const isNotFound = false;

    const handleOpenRegister = () => {
        setOpenRegister(true);
    };

    const handleCloseRegister = () => {
        setOpenRegister(false);
    };

    const handleOpenEdit = (data) => {
        console.log(data);
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

    const handleDeleteRow = (id) => () => {
        Inertia.post(
            route("toolboxtalk.management.preplanning.deleteAssignEmployee"),
            { ids: [id] },
            {
                onStart() {
                    load("Deleting assigned employee's", "Please wait...");
                },
                onFinish() {
                    queryClient.invalidateQueries({
                        queryKey: [
                            "toolboxtalks.preplanning.tbtDailies",
                            user.subscriber_id,
                        ],
                    });
                    stop();
                },
            }
        );
    };

    const handleDeleteRows = (ids) => {
        Inertia.post(
            route("toolboxtalk.management.preplanning.deleteAssignEmployee"),
            { ids },
            {
                onStart() {
                    load("Deleting assigned employee's", "Please wait...");
                },
                onFinish() {
                    queryClient.invalidateQueries({
                        queryKey: [
                            "toolboxtalks.preplanning.tbtDailies",
                            user.subscriber_id,
                        ],
                    });
                    setSelected([]);
                    stop();
                },
            }
        );
    };

    return (
        <>
            <Container maxWidth={themeStretch ? false : "lg"}>
                <CustomBreadcrumbs
                    heading="Daily TBT"
                    links={[
                        {
                            name: "Dashboard",
                            href: PATH_DASHBOARD.root,
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
                                Assign Employee's
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Iconify icon="eva:eye-fill" />}
                                disabled={isLoading}
                            >
                                View PDF
                            </Button>
                        </Stack>
                    }
                />
                <Card>
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
                                        <IconButton color="primary">
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
                                    rowCount={preplanning.length}
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
                                    ) : (
                                        <>
                                            {dataFiltered
                                                .slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage +
                                                        rowsPerPage
                                                )
                                                .map((row) => (
                                                    <PreplanningRegisterTableRow
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
                                                ))}
                                        </>
                                    )}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(
                                            page,
                                            rowsPerPage,
                                            preplanning.length
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
            <RegisterEmployeePortal
                open={openRegister}
                onClose={handleCloseRegister}
                employeeList={employees}
                locationList={locations}
            />

            <RegisterEmployeePortal
                title="Edit Assigned Employee"
                open={openEdit}
                onClose={handleCloseEdit}
                employeeList={employees}
                locationList={locations}
                currentRegistered={selectedEdit}
                isEdit
            />

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
        </>
    );
}

function applyFilter({ inputData, comparator }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    // if (filterName) {
    // 	inputData = inputData.filter(({ position }) => position.toLowerCase().includes(filterName.toLowerCase()));
    // }

    return inputData;
}
