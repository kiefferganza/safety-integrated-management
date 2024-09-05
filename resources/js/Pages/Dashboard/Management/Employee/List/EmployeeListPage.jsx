import { useEffect, useMemo, useState } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import {
    Tab,
    Tabs,
    Card,
    Table,
    Stack,
    Button,
    Tooltip,
    Divider,
    TableBody,
    Container,
    IconButton,
    TableContainer,
    FormHelperText,
    Typography,
    Box,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "@/routes/paths";
// utils
import { fDate } from "@/utils/formatTime";
// components
import Label from "@/Components/label";
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
import EmployeeAnalytic from "@/sections/@dashboard/employee/EmployeeAnalytic";
import {
    EmployeeTableRow,
    EmployeeTableToolbar,
} from "@/sections/@dashboard/employee/list";
import { Head, Link } from "@inertiajs/inertia-react";
import { useSwal } from "@/hooks/useSwal";
import { Inertia } from "@inertiajs/inertia";
import EmployeeAssignment from "../EmployeeAssignment";
import usePermission from "@/hooks/usePermission";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "name", label: "Name", align: "left" },
    { id: "date_created", label: "Create", align: "left" },
    { id: "position", label: "Position", align: "left" },
    { id: "department", label: "Department", align: "left" },
    { id: "company_name", label: "Company", align: "left" },
    // { id: 'nationality', label: 'Nationality', align: 'left' },
    { id: "country", label: "Country", align: "left" },
    { id: "phone_no", label: "Phone No.", align: "left" },
    { id: "trainings", label: "Trainings", align: "left" },
    { id: "is_active", label: "Status", align: "left" },
    { id: "" },
];

// ----------------------------------------------------------------------

export default function EmployeeListPage({ employees, unassignedUsers }) {
    const [hasPermission] = usePermission();
    const theme = useTheme();

    const { themeStretch } = useSettingsContext();
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
        defaultOrderBy: "date_created",
        defaultOrder: "desc",
    });
    const [openAssign, setOpenAssign] = useState(false);
    const [empAssignData, setEmpAssignData] = useState(null);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [openActivate, setOpenActivate] = useState(false);
    const [openDeactivate, setOpenDeactivate] = useState(false);

    const [filterName, setFilterName] = useState("");

    const [filterStatus, setFilterStatus] = useState("all");

    const [filterEndDate, setFilterEndDate] = useState(null);

    const [filterDepartment, setFilterDepartment] = useState([]);

    const [filterPosition, setFilterPosition] = useState([]);

    const [filterCompany, setFilterCompany] = useState([]);

    const [filterStartDate, setFilterStartDate] = useState(null);

    const dataFiltered = applyFilter({
        inputData: employees,
        comparator: getComparator(order, orderBy),
        filterName,
        filterDepartment,
        filterPosition,
        filterStatus,
        filterStartDate,
        filterEndDate,
        filterCompany,
    });

    const denseHeight = dense ? 56 : 76;

    const isFiltered =
        filterStatus !== "all" ||
        filterName !== "" ||
        filterDepartment.length > 0 ||
        filterPosition.length > 0 ||
        filterCompany.length > 0 ||
        !!filterStartDate;

    const isNotFound = dataFiltered.length === 0 && isFiltered;

    const getLengthByStatus = (status) =>
        dataFiltered.filter((item) => item.status === status).length;

    const getPercentByStatus = (status) =>
        (getLengthByStatus(status) / dataFiltered.length) * 100;

    const getUnassignedEmployeeLength = () =>
        dataFiltered.filter((item) => !item.user_id).length;

    const getPercentUnassignedEmployee = () =>
        (getUnassignedEmployeeLength() / dataFiltered.length) * 100;

    const TABS = [
        {
            value: "all",
            label: "All",
            color: "info",
            count: dataFiltered.length,
        },
        {
            value: "active",
            label: "Active",
            color: "success",
            count: getLengthByStatus("active"),
        },
        {
            value: "inactive",
            label: "Inactive",
            color: "warning",
            count: getLengthByStatus("inactive"),
        },
        {
            value: "unassigned",
            label: "Unassigned",
            color: "error",
            count: getUnassignedEmployeeLength(),
        },
    ];

    const OPTIONS = useMemo(() => {
        const departments = new Set([]);
        const positions = new Set([]);
        const companies = new Set([]);
        employees.forEach((emp) => {
            if (emp.department && emp.department.trim()) {
                departments.add(emp.department.trim());
            }
            if (emp.position && emp.position.trim()) {
                positions.add(emp.position.trim());
            }
            if (emp?.company_name && emp?.company_name?.trim()) {
                companies.add(emp.company_name.trim());
            }
        });
        return {
            departments: [...departments],
            positions: [...positions],
            companies: [...companies],
        };
    }, [employees]);

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setOpenActivate(false);
        setOpenDeactivate(false);
    };

    const handleFilterStatus = (_event, newValue) => {
        setPage(0);
        setFilterStatus(newValue);
    };

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleFilterDepartment = (event) => {
        setPage(0);
        setFilterDepartment(event.target.value);
    };

    const handleFilterPosition = (event) => {
        setPage(0);
        setFilterPosition(event.target.value);
    };

    const handleFilterCompany = (event) => {
        setPage(0);
        setFilterCompany(event.target.value);
    };

    const handleDeleteRow = (id) => {
        Inertia.delete(`/dashboard/employee/${id}/delete`, {
            onStart: () => {
                load("Deleting company", "Please wait...");
            },
            onFinish: stop,
            preserveScroll: true,
        });
    };

    const handleDeleteRows = (selected) => {
        Inertia.post(
            route("management.employee.delete-multiple"),
            { ids: selected },
            {
                onStart: () => {
                    load(
                        `Deleting ${selected.length} employee`,
                        "Please wait..."
                    );
                },
                onFinish: () => {
                    setSelected([]);
                    setPage(0);
                    stop();
                },
                preserveScroll: true,
            }
        );
    };

    const handleResetFilter = () => {
        setPage(0);
        setFilterName("");
        setFilterStatus("all");
        setFilterDepartment([]);
        setFilterPosition([]);
        setFilterCompany([]);
        setFilterEndDate(null);
        setFilterStartDate(null);
    };

    const handleOpenAssignment = (emp) => {
        setEmpAssignData(emp);
        setOpenAssign(true);
    };

    const handleCloseAssignment = () => {
        setEmpAssignData(null);
        setOpenAssign(false);
    };

    const handleActivate = () => {
        const ids = selected.filter(
            (id) =>
                employees.find((emp) => emp.employee_id === id)?.is_active === 1
        );
        handleCloseConfirm();
        if (ids.length > 0) {
            Inertia.post(
                route("management.employee.activate"),
                { ids },
                {
                    preserveScroll: true,
                    onStart() {
                        load("Activating employee's", "please wait...");
                    },
                    onFinish() {
                        stop();
                        setSelected([]);
                    },
                }
            );
        }
    };

    const handleDeactivate = () => {
        const ids = selected.filter(
            (id) =>
                employees.find((emp) => emp.employee_id === id)?.is_active === 0
        );
        handleCloseConfirm();
        if (ids.length > 0) {
            Inertia.post(
                route("management.employee.deactivate"),
                { ids },
                {
                    preserveScroll: true,
                    onStart() {
                        load("Deactivating employee's", "please wait...");
                    },
                    onFinish() {
                        stop();
                        setSelected([]);
                    },
                }
            );
        }
    };

    const analytics = {
        total: [dataFiltered.length, 100],
        active: [getLengthByStatus("active"), getPercentByStatus("active")],
        inactive: [
            getLengthByStatus("inactive"),
            getPercentByStatus("inactive"),
        ],
        unassigned: [
            getUnassignedEmployeeLength(),
            getPercentUnassignedEmployee(),
        ],
    };

    const canCreate = hasPermission("employee_create");
    const canDelete = hasPermission("employee_delete");
    const canEditAll = hasPermission("employee_access");
    return (
        <>
            <Head>
                <title>Employee: List</title>
            </Head>

            <Container maxWidth={themeStretch ? false : "lg"}>
                <CustomBreadcrumbs
                    heading="Employee List"
                    links={[
                        {
                            name: "Dashboard",
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: "Employee",
                            href: PATH_DASHBOARD.general.employee,
                        },
                        {
                            name: "List",
                        },
                    ]}
                    action={
                        <Box display="flex" gap={1.5}>
                            <Box>
                                {canCreate ? (
                                    <Button
                                        href={PATH_DASHBOARD.employee.new}
                                        component={Link}
                                        variant="contained"
                                        startIcon={
                                            <Iconify icon="eva:plus-fill" />
                                        }
                                    >
                                        New Employee
                                    </Button>
                                ) : null}
                            </Box>
                        </Box>
                    }
                />

                <Card sx={{ mb: 5 }}>
                    <Scrollbar>
                        <Stack
                            direction="row"
                            divider={
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{ borderStyle: "dashed" }}
                                />
                            }
                            sx={{ py: 2 }}
                        >
                            <EmployeeAnalytic
                                title="Total"
                                total={analytics.total[0]}
                                percent={analytics.total[1]}
                                icon="material-symbols:supervisor-account"
                                color={theme.palette.info.main}
                            />

                            <EmployeeAnalytic
                                title="Active"
                                total={analytics.active[0]}
                                percent={analytics.active[1]}
                                icon="mdi:account-badge"
                                color={theme.palette.success.main}
                            />

                            <EmployeeAnalytic
                                title="Inactive"
                                total={analytics.inactive[0]}
                                percent={analytics.inactive[1]}
                                icon="mdi:account-clock"
                                color={theme.palette.warning.main}
                            />

                            <EmployeeAnalytic
                                title="Unassigned"
                                total={analytics.unassigned[0]}
                                percent={analytics.unassigned[1]}
                                icon="mdi:account-cancel"
                                color={theme.palette.error.main}
                            />
                        </Stack>
                    </Scrollbar>
                </Card>

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

                    <EmployeeTableToolbar
                        filterName={filterName}
                        isFiltered={isFiltered}
                        filterDepartment={filterDepartment}
                        filterPosition={filterPosition}
                        filterCompany={filterCompany}
                        filterEndDate={filterEndDate}
                        onFilterName={handleFilterName}
                        optionsDepartments={OPTIONS.departments}
                        optionsPositions={OPTIONS.positions}
                        optionsCompanies={OPTIONS.companies}
                        filterStartDate={filterStartDate}
                        onResetFilter={handleResetFilter}
                        onFilterDepartment={handleFilterDepartment}
                        onFilterPosition={handleFilterPosition}
                        onFilterCompany={handleFilterCompany}
                        onFilterStartDate={(newValue) => {
                            setFilterStartDate(newValue);
                            setPage(0);
                        }}
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
                                    dataFiltered.map((row) => row.employee_id)
                                )
                            }
                            action={
                                <Stack direction="row" gap={1}>
                                    {canEditAll && (
                                        <>
                                            <Button
                                                startIcon={
                                                    <Iconify icon="mdi:user-key" />
                                                }
                                                onClick={() =>
                                                    setOpenActivate(true)
                                                }
                                            >
                                                Activate
                                            </Button>
                                            <Button
                                                color="warning"
                                                startIcon={
                                                    <Iconify icon="mdi:account-off" />
                                                }
                                                onClick={() =>
                                                    setOpenDeactivate(true)
                                                }
                                            >
                                                Deactivate
                                            </Button>
                                        </>
                                    )}
                                    {canDelete && (
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={handleOpenConfirm}
                                            >
                                                <Iconify icon="eva:trash-2-outline" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
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
                                    rowCount={dataFiltered.length}
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
                                    {dataFiltered
                                        .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        )
                                        .map((row) => (
                                            <EmployeeTableRow
                                                key={row.id}
                                                row={row}
                                                selected={selected.includes(
                                                    row.id
                                                )}
                                                onSelectRow={() =>
                                                    onSelectRow(row.id)
                                                }
                                                onDeleteRow={() =>
                                                    handleDeleteRow(row.id)
                                                }
                                                onAssign={handleOpenAssignment}
                                                canDelete={canDelete}
                                                canEditAll={canEditAll}
                                            />
                                        ))}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(
                                            page,
                                            rowsPerPage,
                                            employees.length
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

            <EmployeeAssignment
                open={openAssign}
                onClose={handleCloseAssignment}
                employee={empAssignData}
                unassignedUsers={unassignedUsers}
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
                            handleDeleteRows(selected);
                            handleCloseConfirm();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
            <ConfirmDialog
                open={openActivate}
                onClose={handleCloseConfirm}
                title="Activate Employee's"
                content={
                    <Stack>
                        <Typography variant="subtitle2">
                            Are you sure want to activate{" "}
                            <strong> {selected.length} </strong> employee?
                        </Typography>
                        <FormHelperText
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                            }}
                        >
                            <Iconify icon="material-symbols:info-outline" />{" "}
                            Already activated account won't be affected.
                        </FormHelperText>
                    </Stack>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleActivate}
                    >
                        Activate
                    </Button>
                }
            />
            <ConfirmDialog
                open={openDeactivate}
                onClose={handleCloseConfirm}
                title="Deactivate Employee's"
                content={
                    <Stack>
                        <Typography variant="subtitle2">
                            Are you sure want to de-activate{" "}
                            <strong> {selected.length} </strong> employee?
                        </Typography>
                        <FormHelperText
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                            }}
                        >
                            <Iconify icon="material-symbols:info-outline" />{" "}
                            Already de-activated account won't be affected.
                        </FormHelperText>
                    </Stack>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeactivate}
                    >
                        Deactivate
                    </Button>
                }
            />
        </>
    );
}

// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filterName,
    filterStatus,
    filterDepartment,
    filterPosition,
    filterCompany,
    filterStartDate,
}) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        inputData = inputData.filter((employee) =>
            employee.fullname.toLowerCase().includes(filterName.toLowerCase())
        );
    }

    if (filterStatus !== "all") {
        if (filterStatus === "unassigned") {
            inputData = inputData.filter((employee) => !employee.user_id);
        } else {
            inputData = inputData.filter(
                (employee) => employee.status === filterStatus
            );
        }
    }

    if (!!filterDepartment.length) {
        inputData = inputData.filter((employee) =>
            filterDepartment.includes(employee?.department?.trim())
        );
    }

    if (!!filterPosition.length) {
        inputData = inputData.filter((employee) =>
            filterPosition.includes(employee?.position?.trim())
        );
    }

    if (!!filterCompany.length) {
        inputData = inputData.filter((employee) =>
            filterCompany.includes(employee?.company_name?.trim())
        );
    }

    if (filterStartDate) {
        const filterDate = fDate(filterStartDate);
        inputData = inputData.filter(
            (emp) => fDate(emp.date_created) === filterDate
        );
    }

    return inputData;
}
