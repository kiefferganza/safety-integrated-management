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
    Divider,
    TableBody,
    Container,
    TableContainer,
    Tooltip,
    IconButton,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "@/routes/paths";
// components
import Label from "@/Components/label";
import Scrollbar from "@/Components/scrollbar";
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
    TableSkeleton,
} from "@/Components/table";
// sections
import EmployeeAnalytic from "@/sections/@dashboard/inspection/EmployeeAnalytic";
import {
    EmployeeTableRow,
    EmployeeTableToolbar,
} from "@/sections/@dashboard/inspection/inspectors";
import Iconify from "@/Components/iconify";
import { format } from "date-fns";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "name", label: "Name", align: "left" },
    { id: "position", label: "Position", align: "left" },
    { id: "department", label: "Department", align: "left" },
    { id: "company_name", label: "Company", align: "left" },
    { id: "country", label: "Country", align: "left" },
    { id: "phone_no", label: "Phone No.", align: "left" },
    { id: "is_active", label: "Status", align: "left" },
    { id: "inspections_count", label: "Inspections", align: "left" },
];

// ----------------------------------------------------------------------

export default function EmployeeListPage({
    employees = [],
    isLoading,
    openPDF,
    setFilterDate,
}) {
    const theme = useTheme();
    const { themeStretch } = useSettingsContext();

    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({
        defaultOrderBy: "inspections_count",
        defaultOrder: "desc",
    });

    const [tableData, setTableData] = useState([]);

    const [filterName, setFilterName] = useState("");

    const [filterStatus, setFilterStatus] = useState("all");

    const [filterPosition, setFilterPosition] = useState([]);

    const [filterDepartment, setFilterDepartment] = useState("all");

    const [filterCompany, setFilterCompany] = useState("all");

    const [filterStartDate, setFilterStartDate] = useState(null);

    const [filterEndDate, setFilterEndDate] = useState(null);

    useEffect(() => {
        if (employees && !isLoading) {
            setTableData(employees);
        }
    }, [employees, isLoading]);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterPosition,
        filterDepartment,
        filterStatus,
        filterCompany,
    });

    const denseHeight = dense ? 56 : 76;

    const isFiltered =
        filterStatus !== "all" ||
        filterName !== "" ||
        filterPosition.length !== 0 ||
        filterDepartment !== "all" ||
        filterCompany !== "all" ||
        filterStartDate !== null ||
        filterEndDate !== null;

    const isNotFound =
        (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterStatus) ||
        (!dataFiltered.length && !!filterPosition.length) ||
        (!dataFiltered.length && filterDepartment !== "all") ||
        (!dataFiltered.length && filterCompany !== "all") ||
        (!dataFiltered.length && !!filterStartDate) ||
        (!dataFiltered.length && !!filterEndDate);

    const getLengthByStatus = (status) =>
        dataFiltered.filter((item) => item.status === status).length;

    const getPercentByStatus = (status) =>
        (getLengthByStatus(status) / dataFiltered.length) * 100;

    const getTotalInspections = () =>
        dataFiltered.reduce((acc, curr) => acc + curr.inspections_count, 0);

    const totalInspections = tableData.reduce(
        (acc, curr) => acc + curr.inspections_count,
        0
    );

    const getPercentInspections = () =>
        ((getTotalInspections() || 1) / totalInspections) * 100;

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
    ];

    const handleFilterStatus = (_event, newValue) => {
        setPage(0);
        setFilterStatus(newValue);
    };

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleFilterPosition = (event) => {
        const {
            target: { value },
        } = event;
        setPage(0);
        setFilterPosition(typeof value === "string" ? value.split(",") : value);
    };

    const handleFilterDepartment = (event) => {
        setPage(0);
        setFilterDepartment(event.target.value);
    };

    const handleFilterCompany = (event) => {
        setPage(0);
        setFilterCompany(event.target.value);
    };

    const handleStartDateChange = (date) => {
        setPage(0);
        setFilterStartDate(date);
        if (filterEndDate) {
            setFilterEndDate(null);
        }
    };

    const handleEndDateChange = (date) => {
        if (filterStartDate) {
            setPage(0);
            setFilterEndDate(date);
            setFilterDate([
                format(filterStartDate, "yyyy-MM-dd"),
                format(date, "yyyy-MM-dd"),
            ]);
        }
    };

    const handleResetFilter = () => {
        setFilterName("");
        setFilterStatus("all");
        setFilterPosition([]);
        setFilterStartDate(null);
        setFilterEndDate(null);
        setFilterCompany("all");
        setPage(0);
        if (filterStartDate && filterEndDate) {
            setFilterDate(null);
        }
    };
    const [DEPARTMENT_OPTIONS, POSITION_OPTIONS, COMPANY_OPTIONS] =
        useMemo(() => {
            if (employees) {
                return [
                    [
                        "all",
                        ...new Set(
                            employees
                                .filter(
                                    (emp) =>
                                        emp.department && emp.department.trim()
                                )
                                .map((emp) => emp.department.trim())
                        ),
                    ],
                    [
                        ...new Set(
                            employees
                                .filter(
                                    (emp) => emp.position && emp.position.trim()
                                )
                                .map((emp) => emp.position.trim())
                        ),
                    ],
                    [
                        "all",
                        ...new Set(
                            employees
                                .filter(
                                    (emp) =>
                                        emp.company_name &&
                                        emp.company_name?.trim()
                                )
                                .map((emp) => emp.company_name.trim())
                        ),
                    ],
                ];
            }
            return [[], ["all"]];
        }, [employees]);

    return (
        <Container maxWidth={themeStretch ? false : "lg"}>
            <CustomBreadcrumbs
                heading="Inspector List"
                links={[
                    {
                        name: "Dashboard",
                        href: PATH_DASHBOARD.root,
                    },
                    {
                        name: "Employees",
                        href: PATH_DASHBOARD.general.employee,
                    },
                    {
                        name: "Authorized Positions",
                        href: PATH_DASHBOARD.inspection.positions,
                    },
                    {
                        name: "Inspection Lists",
                        href: PATH_DASHBOARD.inspection.list,
                    },
                    {
                        name: "List",
                    },
                ]}
                action={
                    <Button
                        variant="contained"
                        onClick={() => {
                            openPDF({ data: dataFiltered });
                        }}
                        disabled={isLoading || !employees}
                    >
                        View as PDF
                    </Button>
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
                            total={dataFiltered.length}
                            percent={100}
                            icon="material-symbols:supervisor-account"
                            color={theme.palette.info.main}
                        />

                        <EmployeeAnalytic
                            title="Active"
                            total={getLengthByStatus("active")}
                            percent={getPercentByStatus("active")}
                            icon="mdi:account-badge"
                            color={theme.palette.success.main}
                        />

                        <EmployeeAnalytic
                            title="Inactive"
                            total={getLengthByStatus("inactive")}
                            percent={getPercentByStatus("inactive")}
                            icon="mdi:account-clock"
                            color={theme.palette.warning.main}
                        />

                        <EmployeeAnalytic
                            title="Total Inspections"
                            total={getTotalInspections()}
                            percent={getPercentInspections()}
                            icon="heroicons:document-magnifying-glass"
                            color={theme.palette.info.main}
                            listTitle="inspections"
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
                    onFilterName={handleFilterName}
                    filterPosition={filterPosition}
                    onFilterPosition={handleFilterPosition}
                    optionsPositions={POSITION_OPTIONS}
                    filterDepartment={filterDepartment}
                    onFilterDepartment={handleFilterDepartment}
                    optionsDepartment={DEPARTMENT_OPTIONS}
                    onResetFilter={handleResetFilter}
                    filterStartDate={filterStartDate}
                    filterEndDate={filterEndDate}
                    onFilterStartDate={handleStartDateChange}
                    onFilterEndDate={handleEndDateChange}
                    filterCompany={filterCompany}
                    optionsCompany={COMPANY_OPTIONS}
                    onFilterCompany={handleFilterCompany}
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
                                <Tooltip title="Print">
                                    <IconButton
                                        onClick={() => {
                                            const data = tableData.filter((d) =>
                                                selected.includes(d.id)
                                            );
                                            openPDF({ data });
                                        }}
                                        color="primary"
                                    >
                                        <Iconify icon="eva:printer-fill" />
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
                                rowCount={dataFiltered.length}
                                numSelected={selected.length}
                                onSort={onSort}
                                onSelectAllRows={(checked) =>
                                    onSelectAllRows(
                                        checked,
                                        dataFiltered
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                            .map((row) => row.id)
                                    )
                                }
                            />

                            <TableBody>
                                {isLoading || !employees
                                    ? [...Array(rowsPerPage)].map(
                                          (_i, index) => (
                                              <TableSkeleton
                                                  key={index}
                                                  sx={{
                                                      height: denseHeight,
                                                  }}
                                              />
                                          )
                                      )
                                    : dataFiltered
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
                                              />
                                          ))}

                                {(!isLoading || !employees) && (
                                    <>
                                        <TableEmptyRows
                                            height={denseHeight}
                                            emptyRows={emptyRows(
                                                page,
                                                rowsPerPage,
                                                tableData.length
                                            )}
                                        />
                                        <TableNoData isNotFound={isNotFound} />
                                    </>
                                )}
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
    );
}

// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filterName,
    filterStatus,
    filterPosition,
    filterDepartment,
    filterCompany,
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

    if (filterPosition.length > 0) {
        inputData = inputData.filter((employee) =>
            filterPosition.includes(employee.position.trim())
        );
    }

    if (filterDepartment !== "all") {
        inputData = inputData.filter(
            (employee) => employee.department.trim() === filterDepartment
        );
    }

    if (filterCompany !== "all") {
        inputData = inputData.filter(
            (employee) => employee.company_name?.trim() === filterCompany
        );
    }

    return inputData;
}
