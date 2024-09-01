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
    RegisterTableRow,
    RegisterTableToolbar,
} from "@/sections/@dashboard/training/list";
import NewRegisterDialog from "@/sections/@dashboard/training/portal/NewRegisterDialog";
import { Inertia } from "@inertiajs/inertia";
import { useSwal } from "@/hooks/useSwal";
import { useSnackbar } from "notistack";

const TABLE_HEAD = [
    { id: "index", label: "#", align: "left" },
    { id: "course_name", label: "Course", align: "left" },
    { id: "acronym", label: "Abbreviation", align: "left" },
    { id: "created_at", label: "Date Created", align: "left" },
    { id: "" },
];

const NewCourseSchema = Yup.object().shape({
    courseItem: Yup.array().of(
        Yup.object().shape({
            course_name: Yup.string().required(
                "Name of the course is required."
            ),
            acronym: Yup.string().required(
                "Please add an abbreviation name of this course."
            ),
        })
    ),
});

export default function TrainingCoursesListPage({ courses }) {
    const { themeStretch } = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();

    const methods = useForm({
        resolver: yupResolver(NewCourseSchema),
        defaultValues: {
            courseItem: [{ course_name: "", acronym: "", id: 0 }],
        },
    });

    const { reset, setValue } = methods;

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

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
        if (courses && courses.length > 0) {
            setTableData(courses);
        }
    }, [courses]);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [filterName, setFilterName] = useState("");
    const [filterDate, setFilterDate] = useState(null);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterDate,
    });

    const denseHeight = dense ? 56 : 76;

    const isFiltered = filterName !== "" || !!filterDate;

    const isNotFound =
        (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterDate);

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleFilterDate = (newValue) => {
        setPage(0);
        setFilterDate(newValue);
    };

    const handleResetFilter = () => {
        setFilterName("");
        setFilterDate(null);
    };

    const handleOpenAddCourse = () => setOpenAdd(true);
    const handleCloseAddCourse = () => {
        setOpenAdd(false);
        reset({ courseItem: [{ course_name: "", id: 0 }] });
    };
    const handleOpenEditCourse = (course) => {
        setValue("courseItem.0.course_name", course.course_name);
        setValue("courseItem.0.acronym", course.acronym ?? "");
        setValue("courseItem.0.id", course.id);
        setOpenEdit(true);
    };
    const handleCloseEditCourse = () => {
        setOpenEdit(false);
        reset({ courseItem: [{ course_name: "", id: 0 }] });
    };

    const handleCreateCourse = ({ courseItem }) => {
        const courses = courseItem.map((course) => ({
            course_name: course.course_name,
        }));

        Inertia.post(
            route("training.management.new_courses"),
            { courses },
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

    const handleUpdateCourse = ({ courseItem }) => {
        const course = courseItem[0];
        const duplicateAbbv = courses.some(
            (c) => c.acronym === course.acronym && c.id !== course.id
        );
        if (duplicateAbbv) {
            enqueueSnackbar("Abbreviation is already taken", {
                variant: "error",
            });
            return;
        }
        Inertia.post(
            route("training.management.update_course", course.id),
            {
                course_name: course.course_name,
                acronym: course.acronym,
            },
            {
                onStart: () => {
                    handleCloseEditCourse();
                    load("Updating course", "Please wait...");
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
            route("training.management.delete_courses"),
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
            route("training.management.delete_courses"),
            { ids: sel },
            {
                onStart: () => {
                    load(
                        `Deleting ${selected.length} courses`,
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
                            name: "Create Training",
                            href: PATH_DASHBOARD.training.new(2),
                        },
                        {
                            name: "Registered Courses",
                        },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            onClick={handleOpenAddCourse}
                        >
                            New Course
                        </Button>
                    }
                />

                <Card>
                    <RegisterTableToolbar
                        filterName={filterName}
                        isFiltered={isFiltered}
                        onFilterName={handleFilterName}
                        filterDate={filterDate}
                        onResetFilter={handleResetFilter}
                        onFilterDate={handleFilterDate}
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
                                            <RegisterTableRow
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
                                                onUpdateRow={() =>
                                                    handleOpenEditCourse(row)
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
            <FormProvider methods={methods}>
                <NewRegisterDialog
                    title="Edit Course"
                    open={openEdit}
                    onClose={handleCloseEditCourse}
                    onUpdate={handleUpdateCourse}
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

function applyFilter({ inputData, comparator, filterName, filterDate }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        inputData = inputData.filter((course) =>
            course?.course_name.toLowerCase().includes(filterName.toLowerCase())
        );
    }

    if (filterDate) {
        const dateFiltered = fDate(filterDate);
        inputData = inputData.filter(
            (course) => fDate(course?.date_created) === dateFiltered
        );
    }

    return inputData;
}
