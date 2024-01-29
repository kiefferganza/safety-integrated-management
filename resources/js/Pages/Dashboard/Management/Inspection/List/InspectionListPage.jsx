import { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";
import { Head, Link } from "@inertiajs/inertia-react";
import { useSwal } from "@/hooks/useSwal";
import { Inertia } from "@inertiajs/inertia";
import { employeeName } from "@/utils/formatName";
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
    Typography,
    Box,
    Popover,
    FormControlLabel,
    Switch,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "@/routes/paths";
// utils
import { fTimestamp } from "@/utils/formatTime";
// components
import Label from "@/Components/label";
import Iconify from "@/Components/iconify";
import Scrollbar from "@/Components/scrollbar";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs";
import ConfirmDialog from "@/Components/confirm-dialog";
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
    InspectionTableRow,
    InspectionTableToolbar,
} from "@/sections/@dashboard/inspection/list";
import InspectionAnalytic from "@/sections/@dashboard/inspection/InspectionAnalytic";
import usePermission from "@/hooks/usePermission";
import { getObservation } from "@/utils/inspection";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "form_number", label: "CMS Number", align: "left" },
    { id: "inspected_by", label: "Submitted", align: "center" },
    { id: "reviewer", label: "Action", align: "center" },
    { id: "verifier", label: "Verify", align: "center" },
    { id: "date_issued", label: "Date Issued", align: "left" },
    { id: "totalObservation", label: "O", align: "right" },
    { id: "negativeObservation", label: "N", align: "right" },
    { id: "positiveObservation", label: "P", align: "right" },
    { id: "status", label: "S", align: "center" },
    { id: "" },
];

const InspectionListPage = ({ user, inspections }) => {
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
    } = useTable();

    const [openConfirm, setOpenConfirm] = useState(false);

    const [anchorLegendEl, setAnchorLegendEl] = useState(null);

    const [tableData, setTableData] = useState([]);

    const [filterRelated, setFilterRelated] = useState(false);

    const [filterName, setFilterName] = useState("");

    const [filterType, setFilterType] = useState("all");

    const [filterStatus, setFilterStatus] = useState("");

    const [filterStartDate, setFilterStartDate] = useState(null);

    const [filterEndDate, setFilterEndDate] = useState(null);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterStartDate,
        filterEndDate,
        filterRelated,
        user,
    });

    const dataFilteredStatusAndType = applyFilterStatusType({
        inputData: [...dataFiltered],
        comparator: getComparator(order, orderBy),
        filterStatus,
        filterType,
    });

    useEffect(() => {
        const data = inspections?.map((inspection) => ({
            ...inspection,
            id: inspection.inspection_id,
            reviewer: employeeName(inspection.reviewer).trim(),
            verifier: employeeName(inspection.verifier).trim(),
            status: getInspectionStatus(inspection.status),
            type: getInspectionType({ status: inspection.status }),
            ...getObservation(inspection.report_list),
            dueStatus: getDueDateStatus(inspection.date_due),
        }));
        setTableData(data || []);
    }, [user, inspections]);

    const getInspectionType = ({ status }) => {
        switch (status) {
            case 1:
            case 0:
                return "submitted";
            case 2:
                return "verify";
            case 3:
                return "closeout";
            default:
                return "review";
        }
    };

    const denseHeight = dense ? 56 : 76;

    const isFiltered =
        filterType !== "all" ||
        filterName !== "" ||
        !!filterStartDate ||
        !!filterEndDate ||
        filterStatus !== "";

    const isNotFound =
        (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterType) ||
        (!dataFiltered.length && !!filterStatus) ||
        (!dataFiltered.length && !!filterStartDate);
    !dataFiltered.length && !!filterEndDate;

    const getLengthByType = (type) =>
        dataFiltered.filter((item) => item.type === type).length;

    const getPercentByType = (type) =>
        (getLengthByType(type) / dataFiltered.length) * 100;

    const TABS = [
        {
            value: "all",
            label: "All",
            color: "info",
            count: dataFiltered.length,
        },
        {
            value: "submitted",
            label: "Submitted",
            color: "default",
            count: getLengthByType("submitted"),
        },
        {
            value: "review",
            label: "Review",
            color: "error",
            count: getLengthByType("review"),
        },
        {
            value: "verify",
            label: "Verify & Approve",
            color: "warning",
            count: getLengthByType("verify"),
        },
        {
            value: "closeout",
            label: "Closeout",
            color: "success",
            count: getLengthByType("closeout"),
        },
    ];

    const getActiveDays = dataFiltered.filter(
        (item) => item.dueStatus.classType === "success"
    ).length;
    const getDueDays = dataFiltered.filter(
        (item) => item.dueStatus.classType === "error"
    ).length;
    const getStatusLength = (status) =>
        dataFiltered.filter((item) => item.status.text === status).length;

    const STATUS_TABS = [
        {
            value: "I P",
            label: "In Progress",
            color: "info",
            count: getStatusLength("I P"),
        },
        {
            value: "W F C",
            label: "Waiting For Closure",
            color: "warning",
            count: getStatusLength("W F C"),
        },
        {
            value: "C",
            label: "Closed",
            color: "success",
            count: getStatusLength("C"),
        },
        {
            value: "F R",
            label: "For Revision",
            color: "error",
            count: getStatusLength("F R"),
        },
        {
            value: "A.D.",
            label: "Active Days",
            color: "success",
            count: getActiveDays,
        },
        {
            value: "O.D.",
            label: "Overdue Days",
            color: "error",
            count: getDueDays,
        },
    ];

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleFilterType = (_event, newValue) => {
        setPage(0);
        setFilterType(newValue);
    };

    const handleFilterStatus = (_event, newValue) => {
        if (newValue) {
            setPage(0);
            setFilterStatus(newValue);
        }
    };

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleDeleteRow = (id) => {
        Inertia.post(
            route("inspection.management.delete"),
            { ids: [id] },
            {
                onStart: () => {
                    load("Deleting inspection", "Please wait...");
                },
                onFinish: stop,
                preserveScroll: true,
            }
        );
    };

    const handleDeleteRows = (selected) => {
        if (user?.emp_id !== 1) return;
        Inertia.post(
            route("inspection.management.delete"),
            { ids: selected },
            {
                onStart: () => {
                    load(
                        `Deleting ${selected.length} inspections`,
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
        setFilterName("");
        setFilterType("all");
        setFilterStartDate(null);
        setFilterEndDate(null);
        setFilterStatus("");
        setFilterRelated(false);
    };

    const handlePopoverLegendOpen = (event) => {
        setAnchorLegendEl(event.currentTarget);
    };

    const handlePopoverLegendClose = () => {
        setAnchorLegendEl(null);
    };

    const open = Boolean(anchorLegendEl);

    const canCreate = hasPermission("inspection_create");
    const canEdit = hasPermission("inspection_edit");
    const canDelete = hasPermission("inspection_delete");

    const currentData =
        filterType !== "all" || filterStatus !== ""
            ? dataFilteredStatusAndType
            : dataFiltered;
    return (
        <>
            <Head>
                <title>Inpection: List</title>
            </Head>

            <Container maxWidth={themeStretch ? false : "lg"}>
                <CustomBreadcrumbs
                    heading="Inpection List"
                    links={[
                        {
                            name: "Dashboard",
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: "Inspection",
                        },
                        {
                            name: "List",
                        },
                    ]}
                    action={
                        <Box display="flex" gap={1.5}>
                            <Box>
                                <Button
                                    target="_blank"
                                    variant="contained"
                                    onClick={() => {
                                        Inertia.post(
                                            route(
                                                "inspection.management.pdfListPost"
                                            ),
                                            {
                                                inspections: currentData.map(
                                                    (ins) => {
                                                        ins.report_list =
                                                            ins.report_list.filter(
                                                                (l) =>
                                                                    l.ref_score ===
                                                                        2 ||
                                                                    l.ref_score ===
                                                                        3
                                                            );
                                                        return ins;
                                                    }
                                                ),
                                            }
                                        );
                                    }}
                                >
                                    View as PDF
                                </Button>
                            </Box>
                            {canCreate && (
                                <Box>
                                    <Stack>
                                        <Button
                                            href={PATH_DASHBOARD.inspection.new}
                                            component={Link}
                                            variant="contained"
                                            startIcon={
                                                <Iconify icon="eva:plus-fill" />
                                            }
                                        >
                                            New Inspection
                                        </Button>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={filterRelated}
                                                    onChange={() => {
                                                        setFilterRelated(
                                                            (currState) =>
                                                                !currState
                                                        );
                                                        setPage(0);
                                                    }}
                                                    name="related"
                                                />
                                            }
                                            label={
                                                <Typography variant="subtitle2">
                                                    Related to you
                                                </Typography>
                                            }
                                        />
                                    </Stack>
                                </Box>
                            )}
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
                            <InspectionAnalytic
                                title="Total"
                                total={dataFiltered.length}
                                percent={100}
                                icon="heroicons:document-chart-bar"
                                color={theme.palette.info.main}
                            />

                            <InspectionAnalytic
                                title="Submitted"
                                total={getLengthByType("submitted")}
                                percent={getPercentByType("submitted")}
                                icon="heroicons:document-magnifying-glass"
                                color={theme.palette.grey[500]}
                            />

                            <InspectionAnalytic
                                title="Review"
                                total={getLengthByType("review")}
                                percent={getPercentByType("review")}
                                icon="heroicons:document-minus"
                                color={theme.palette.error.main}
                            />

                            <InspectionAnalytic
                                title="Verify & Approve"
                                total={getLengthByType("verify")}
                                percent={getPercentByType("verify")}
                                icon="heroicons:document-check"
                                color={theme.palette.warning.main}
                            />

                            <InspectionAnalytic
                                title="Closeout"
                                total={getLengthByType("closeout")}
                                percent={getPercentByType("closeout")}
                                icon="heroicons:document-arrow-up"
                                color={theme.palette.info.main}
                            />
                        </Stack>
                    </Scrollbar>
                </Card>

                <Card>
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{ px: 2, bgcolor: "background.neutral" }}
                    >
                        <Tabs
                            value={filterType}
                            onChange={handleFilterType}
                            sx={{ width: 1, flex: 0.7 }}
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
                        <Tabs
                            sx={{ flex: 0.5 }}
                            value={filterStatus}
                            onChange={handleFilterStatus}
                        >
                            <Tab
                                label="Legend"
                                color="info"
                                value={false}
                                icon={
                                    <Label color="info" sx={{ mr: 1 }}>
                                        L
                                    </Label>
                                }
                                aria-owns={
                                    open ? "mouse-over-popover" : undefined
                                }
                                aria-haspopup="true"
                                onMouseEnter={handlePopoverLegendOpen}
                                onMouseLeave={handlePopoverLegendClose}
                            />
                            {STATUS_TABS.map((tab) => (
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
                    </Stack>

                    <Divider />

                    <InspectionTableToolbar
                        filterName={filterName}
                        isFiltered={isFiltered}
                        onFilterName={handleFilterName}
                        filterStartDate={filterStartDate}
                        filterEndDate={filterEndDate}
                        onResetFilter={handleResetFilter}
                        onFilterStartDate={(newValue) => {
                            if (filterEndDate) {
                                setFilterEndDate(null);
                            }
                            setFilterStartDate(newValue);
                        }}
                        onFilterEndDate={(newValue) => {
                            setFilterEndDate(newValue);
                        }}
                    />

                    <TableContainer
                        sx={{ position: "relative", overflow: "unset" }}
                    >
                        <TableSelectedAction
                            dense={dense}
                            numSelected={selected.length}
                            rowCount={
                                (filterType !== "all" || filterStatus !== ""
                                    ? dataFilteredStatusAndType
                                    : dataFiltered
                                ).length
                            }
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    (filterType !== "all" || filterStatus !== ""
                                        ? dataFilteredStatusAndType
                                        : dataFiltered
                                    ).map((row) => row.id)
                                )
                            }
                            action={
                                <Stack direction="row">
                                    <Tooltip title="Print">
                                        <IconButton
                                            color="primary"
                                            onClick={() => {
                                                const lookupTable = {};
                                                tableData.forEach(
                                                    (obj) =>
                                                        (lookupTable[obj.id] =
                                                            obj)
                                                );
                                                const data = selected.map(
                                                    (id) => {
                                                        const found =
                                                            lookupTable[id];
                                                        if (found) {
                                                            found.report_list =
                                                                found.report_list.filter(
                                                                    (l) =>
                                                                        l.ref_score ===
                                                                            2 ||
                                                                        l.ref_score ===
                                                                            3
                                                                );
                                                        }
                                                        return found;
                                                    }
                                                );
                                                Inertia.post(
                                                    route(
                                                        "inspection.management.pdfListPost"
                                                    ),
                                                    { inspections: data }
                                                );
                                            }}
                                        >
                                            <Iconify icon="eva:printer-fill" />
                                        </IconButton>
                                    </Tooltip>
                                    {user.emp_id === 1 && (
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="primary"
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
                                    rowCount={tableData.length}
                                    numSelected={selected.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            (filterType !== "all" ||
                                            filterStatus !== ""
                                                ? dataFilteredStatusAndType
                                                : dataFiltered
                                            )
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
                                    {currentData
                                        .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        )
                                        .map((row) => (
                                            <InspectionTableRow
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
                                                canEdit={canEdit}
                                                canDelete={canDelete}
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
                        count={
                            (filterType !== "all" || filterStatus !== ""
                                ? dataFilteredStatusAndType
                                : dataFiltered
                            ).length
                        }
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
                            handleDeleteRows(selected);
                            handleCloseConfirm();
                        }}
                    >
                        Delete
                    </Button>
                }
            />

            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: "none",
                }}
                open={open}
                anchorEl={anchorLegendEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                onClose={handlePopoverLegendClose}
                disableRestoreFocus
            >
                <Box sx={{ px: 2.5, py: 3 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, color: "text.secondary" }}
                    >
                        Status Legends:
                    </Typography>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        gap={1}
                        sx={{ mb: 1.5 }}
                    >
                        <Label variant="outlined" color="warning">
                            I P = In Progress
                        </Label>
                        <Label variant="outlined" color="error">
                            W F C = Waiting For Closure
                        </Label>
                        <Label variant="outlined" color="success">
                            C = Closed
                        </Label>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        gap={1}
                        sx={{ mb: 1.5 }}
                    >
                        <Label variant="outlined" color="error">
                            F R = For Revision
                        </Label>
                        <Label variant="outlined" color="success">
                            A.D. = Active Days
                        </Label>
                        <Label variant="outlined" color="error">
                            O.D. = Overdue Days
                        </Label>
                    </Stack>
                    <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, color: "text.secondary" }}
                    >
                        Table Title Legends:
                    </Typography>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        gap={1}
                        sx={{ mb: 1.5 }}
                    >
                        <Label variant="outlined" color="default">
                            O = Number of Observation
                        </Label>
                        <Label variant="outlined" color="default">
                            P. = Number of Positive Observation
                        </Label>
                    </Stack>
                    <Stack direction="row" gap={1} sx={{ mb: 1.5 }}>
                        <Label variant="outlined" color="default">
                            N = Number of Negative Observation
                        </Label>
                        <Label variant="outlined" color="default">
                            S = Statuses
                        </Label>
                    </Stack>
                </Box>
            </Popover>
        </>
    );
};

const getInspectionStatus = (status) => {
    let result = {
        code: status,
        classType: "default",
        text: "",
        tooltip: "",
    };
    switch (status) {
        case 1:
        case 0:
            result.classType = "warning";
            result.text = "I P";
            result.tooltip = "In Progress";
            break;
        case 2:
            result.classType = "warning";
            result.text = "W F C";
            result.tooltip = "Waiting For Closure";
            break;
        case 3:
            result.classType = "success";
            result.text = "C";
            result.tooltip = "Closed";
            break;
        default:
            result.classType = "error";
            result.text = "F R";
            result.tooltip = "For Revision";
    }
    return result;
};

const getDueDateStatus = (dueDate) => {
    const diff = differenceInDays(new Date(dueDate), new Date());

    if (diff === 0) {
        return {
            text: "A.T.",
            tooltip: "Active Today",
            classType: "warning",
        };
    }

    return {
        text: diff > 0 ? `${diff} A.D.` : `${Math.abs(diff)} O.D.`,
        tooltip: diff > 0 ? `Active ${diff} days` : `Overdue ${Math.abs(diff)}`,
        classType: diff > 0 ? "success" : "error",
        type: diff > 0 ? "A.D." : "O.D.",
    };
};

// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filterName,
    filterStartDate,
    filterEndDate,
    filterRelated,
    user,
}) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterRelated) {
        inputData = inputData.filter(
            (ins) =>
                ins.employee_id === user.emp_id ||
                ins.verifier_id === user.emp_id ||
                ins.reviewer_id === user.emp_id
        );
    }

    if (filterName) {
        inputData = inputData.filter(
            (inspection) =>
                inspection.form_number
                    .toLowerCase()
                    .indexOf(filterName.toLowerCase()) !== -1 ||
                inspection.reviewer
                    .toLowerCase()
                    .indexOf(filterName.toLowerCase()) !== -1 ||
                inspection.inspected_by
                    .toLowerCase()
                    .indexOf(filterName.toLowerCase()) !== -1 ||
                inspection.verifier
                    .toLowerCase()
                    .indexOf(filterName.toLowerCase()) !== -1
        );
    }

    if (filterStartDate && !filterEndDate) {
        const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
        inputData = inputData.filter(
            (insp) =>
                fTimestamp(new Date(insp.date_issued)) >= startDateTimestamp
        );
    }

    if (filterStartDate && filterEndDate) {
        const startDateTimestamp = filterStartDate.setHours(0, 0, 0, 0);
        const endDateTimestamp = filterEndDate.setHours(0, 0, 0, 0);
        inputData = inputData.filter(
            (insp) =>
                fTimestamp(new Date(insp.date_issued)) >= startDateTimestamp &&
                fTimestamp(new Date(insp.date_issued)) <= endDateTimestamp
        );
    }

    return inputData;
}

function applyFilterStatusType({
    inputData,
    comparator,
    filterType,
    filterStatus,
}) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterType !== "all") {
        inputData = inputData.filter(
            (inspection) => inspection.type === filterType
        );
    }

    if (filterStatus !== "") {
        if (filterStatus === "A.D." || filterStatus === "O.D.") {
            inputData = inputData.filter(
                (inspection) => inspection.dueStatus.type === filterStatus
            );
        } else {
            inputData = inputData.filter(
                (inspection) => inspection.status.text === filterStatus
            );
        }
    }

    return inputData;
}

export default InspectionListPage;
