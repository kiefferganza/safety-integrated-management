import { useEffect, useState } from "react";
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
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "@/routes/paths";
// components
import Label from "@/Components/label";
import Iconify from "@/Components/iconify";
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "name", label: "Name", align: "left" },
    { id: "position", label: "Position", align: "left" },
    { id: "department", label: "Department", align: "left" },
    { id: "country", label: "Country", align: "left" },
    { id: "phone_no", label: "Phone No.", align: "left" },
    { id: "is_active", label: "Status", align: "left" },
    { id: "inspections_count", label: "Inspections", align: "left" },
];

// ----------------------------------------------------------------------

export default function EmployeeListPage({
    employees,
    isLoading,
    registeredPositions,
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
        defaultOrderBy: "date_created",
        defaultOrder: "desc",
    });

    const [tableData, setTableData] = useState([]);

    const [filterName, setFilterName] = useState("");

    const [filterStatus, setFilterStatus] = useState("all");

    const [filterEndDate, setFilterEndDate] = useState(null);

    const [filterPosition, setFilterPosition] = useState("all");

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterPosition,
        filterStatus,
        filterEndDate,
    });
    useEffect(() => {
        if (!!employees) {
            const data = employees
                ?.filter((e) => e.inspections_count !== 0)
                ?.map((employee) => ({
                    ...employee,
                    id: employee.employee_id,
                    status: employee.is_active === 0 ? "active" : "inactive",
                    phone_no:
                        employee.phone_no == 0 ? "N/A" : employee.phone_no,
                }));
            setTableData(data || []);
        }
    }, [employees]);

    const denseHeight = dense ? 56 : 76;

    const isFiltered =
        filterStatus !== "all" || filterName !== "" || filterPosition !== "all";

    const isNotFound =
        (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterStatus) ||
        (!dataFiltered.length && !!filterPosition) ||
        (!dataFiltered.length && !!filterEndDate);

    const getLengthByStatus = (status) =>
        tableData.filter((item) => item.status === status).length;

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
        { value: "all", label: "All", color: "info", count: tableData.length },
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
        setPage(0);
        setFilterPosition(event.target.value);
    };

    const handleResetFilter = () => {
        setFilterName("");
        setFilterStatus("all");
        setFilterPosition("all");
        setFilterEndDate(null);
    };

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
                action={<Button variant="contained">View as PDF</Button>}
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
                    filterPosition={filterPosition}
                    filterEndDate={filterEndDate}
                    onFilterName={handleFilterName}
                    optionsPositions={registeredPositions}
                    onResetFilter={handleResetFilter}
                    onFilterPosition={handleFilterPosition}
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
                                    <IconButton color="primary">
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
    );
}

// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filterName,
    filterStatus,
    filterPosition,
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

    if (filterPosition !== "all") {
        inputData = inputData.filter(
            (employee) => employee.position.trim() === filterPosition.trim()
        );
    }

    return inputData;
}
