import { useEffect, useState } from "react";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
    Card,
    Table,
    Stack,
    Button,
    Tooltip,
    TableBody,
    Container,
    IconButton,
    TableContainer,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "@/routes/paths";
// Components
import FormProvider from "@/Components/hook-form";
import Iconify from "@/Components/iconify";
import Scrollbar from "@/Components/scrollbar";
import ConfirmDialog from "@/Components/confirm-dialog";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
import { useSettingsContext } from "@/Components/settings";
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from "@/Components/table";
// sections
import {
    PositionsTableRow,
    PositionsTableToolbar,
} from "@/sections/@dashboard/inspection/inspectors";
import NewRegisterDialog from "@/sections/@dashboard/training/portal/NewRegisterDialog";
import { Inertia } from "@inertiajs/inertia";
import { useSwal } from "@/hooks/useSwal";

const TABLE_HEAD = [
    { id: "index", label: "#", align: "left" },
    { id: "position", label: "Position", align: "left" },
    { id: "" },
];

const NewPositionSchema = Yup.object().shape({
    positionItem: Yup.array().of(
        Yup.object().shape({
            position: Yup.string().required("Position title is required."),
        })
    ),
});

export default function AuthorizedPositionListPage({ positions }) {
    const { themeStretch } = useSettingsContext();

    const methods = useForm({
        resolver: yupResolver(NewPositionSchema),
        defaultValues: {
            positionItem: [{ position: "", id: 0 }],
        },
    });

    const { reset } = methods;

    const [openAdd, setOpenAdd] = useState(false);

    const { load, stop } = useSwal();
    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
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
    } = useTable({
        defaultRowsPerPage: 10,
    });

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (positions && positions.length > 0) {
            setTableData(positions);
        }
    }, [positions]);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [filterName, setFilterName] = useState("");

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const denseHeight = dense ? 56 : 76;

    const isFiltered = filterName !== "";

    const isNotFound = !dataFiltered.length && !!filterName;

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleResetFilter = () => {
        setFilterName("");
    };

    const handleOpenAddCourse = () => setOpenAdd(true);
    const handleCloseAddCourse = () => {
        setOpenAdd(false);
        reset({ positionItem: [{ position: "", id: 0 }] });
    };

    const handleCreateCourse = ({ positionItem }) => {
        const positions = positionItem.map((course) => ({
            position: course.position,
        }));

        Inertia.post(
            route("inspection.management.inspector.positions.create"),
            { positions },
            {
                onStart: () => {
                    handleCloseAddCourse();
                    load("Adding new course", "Please wait...");
                },
                onFinish: stop,
                preserveScroll: true,
            }
        );
    };

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleDeleteRow = (id) => {
        Inertia.post(
            route("inspection.management.inspector.positions.delete"),
            { ids: [id] },
            {
                onStart: () => {
                    load("Deleting course", "Please wait...");
                },
                onFinish: stop,
                preserveScroll: true,
            }
        );
    };

    const handleDeleteRows = (sel) => {
        Inertia.post(
            route("inspection.management.inspector.positions.delete"),
            { ids: sel },
            {
                onStart: () => {
                    load(
                        `Deleting ${selected.length} positions`,
                        "Please wait..."
                    );
                },
                onFinish: () => {
                    setSelected([]);
                    stop();
                },
                preserveScroll: true,
            }
        );
    };

    return (
        <>
            <Container maxWidth={themeStretch ? false : "lg"}>
                <CustomBreadcrumbs
                    heading="Registered Course List"
                    links={[
                        {
                            name: "Dashboard",
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: "Inspection Employees",
                            href: PATH_DASHBOARD.inspection.inspectors,
                        },
                        {
                            name: "Authorized Positions",
                        },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            onClick={handleOpenAddCourse}
                        >
                            New Position
                        </Button>
                    }
                />

                <Card>
                    <PositionsTableToolbar
                        filterName={filterName}
                        isFiltered={isFiltered}
                        onFilterName={handleFilterName}
                        onResetFilter={handleResetFilter}
                    />

                    <TableContainer
                        sx={{ position: "relative", overflow: "unset" }}
                    >
                        <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={tableData.length}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    tableData.map((row) => row.id)
                                )
                            }
                            action={
                                <Stack direction="row">
                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="primary"
                                            onClick={handleOpenConfirm}
                                        >
                                            <Iconify icon="eva:trash-2-outline" />
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
                                            tableData.map((row) => row.id)
                                        )
                                    }
                                />
                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        )
                                        .map((row, index) => (
                                            <PositionsTableRow
                                                key={row.id}
                                                row={row}
                                                index={index + 1}
                                                selected={selected.includes(
                                                    row.id
                                                )}
                                                onSelectRow={() =>
                                                    onSelectRow(row.id)
                                                }
                                                onDeleteRow={() =>
                                                    handleDeleteRow(row.id)
                                                }
                                            />
                                        ))}

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
            <FormProvider methods={methods}>
                <NewRegisterDialog
                    open={openAdd}
                    onClose={handleCloseAddCourse}
                    onCreate={handleCreateCourse}
                />
            </FormProvider>
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

function applyFilter({ inputData, comparator, filterName }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        inputData = inputData.filter((course) =>
            course?.position.toLowerCase().includes(filterName.toLowerCase())
        );
    }

    return inputData;
}
