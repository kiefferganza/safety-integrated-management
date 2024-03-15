import { useEffect, useRef, useState } from "react";
import { ListboxComponent } from "@/Components/auto-complete";
import Iconify from "@/Components/iconify";
import { yupResolver } from "@hookform/resolvers/yup";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Portal from "@mui/material/Portal";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import { useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";

import Scrollbar from "@/Components/scrollbar";
import { useSwal } from "@/hooks/useSwal";
import { sleep } from "@/lib/utils";
import { Inertia } from "@inertiajs/inertia";
import Avatar from "@mui/material/Avatar";
import { addDays, format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { usePage } from "@inertiajs/inertia-react";
import { RHFMuiSelect, RHFTextField } from "@/Components/hook-form";
import FormProvider from "@/Components/hook-form/FormProvider";

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: "border-box",
        "& ul": {
            padding: 0,
            margin: 0,
        },
        "& ul>li": { borderRadius: 0 },
    },
});

const TOMORROW = addDays(new Date(), 1);

const RegisterEmployeePortal = ({
    title = "Assign Employee's",
    open,
    onClose,
    isEdit = false,
    projectDetails = [],
    sequenceNo,
    //
    currentRegistered = null,
    employeeList = [],
    ...other
}) => {
    const {
        auth: { user },
    } = usePage().props;
    const queryClient = useQueryClient();
    const scrollbarRef = useRef(null);
    const { load, stop } = useSwal();

    const [trainerVal, setTrainerVal] = useState("");
    const [witnessVal, setWitnessVal] = useState("");
    const [autoCompleteErr, setAutoCompleteErr] = useState({
        employee: null,
        trainer: null,
        witness: null,
    });
    const [autoCompleteVal, setAutoCompleteVal] = useState({
        fullname: "",
        emp_id: "",
        position: "",
        img: "",
    });
    const [autoCompleteInputVal, setAutoCompleteInputVal] = useState("");

    const RegisterEmployeeSchema = Yup.object().shape({
        location: Yup.string().required("Please add a location."),
        exact_location: Yup.string().required("Please add exact location."),
        originator: Yup.string().required("Please add originator."),
        project_code: Yup.string().required("Please add project_code."),
        discipline: Yup.string().required("Please add discipline."),
        document_type: Yup.string().required("Please add document type."),
        dateIssued: Yup.date()
            .min(
                isEdit && currentRegistered?.date_issued
                    ? new Date(currentRegistered.date_issued)
                    : TOMORROW,
                "Date is too early"
            )
            .required("Please enter a valid date"),
        employees: Yup.array()
            .min(1, "Add at least one employee")
            .of(
                Yup.object().shape({
                    emp_id: Yup.string().required(
                        "Please select a valid employee."
                    ),
                    position: Yup.string(),
                    trainer: Yup.string().required("Please add trainer"),
                    witness: Yup.string().required("Please add witness"),
                })
            ),
    });

    const defaultValues = {
        employees: currentRegistered?.assigned ?? [],
        dateIssued: currentRegistered?.date_issued
            ? new Date(currentRegistered.date_issued)
            : TOMORROW,
        location: currentRegistered?.location ?? "",
        exact_location: currentRegistered?.exact_location ?? "",
        originator: currentRegistered?.originator ?? "",
        project_code: currentRegistered?.project_code ?? "",
        discipline: currentRegistered?.discipline ?? "",
        document_type: currentRegistered?.document_type ?? "",
    };

    const methods = useForm({
        resolver: yupResolver(RegisterEmployeeSchema),
        defaultValues,
    });

    const {
        control,
        reset,
        handleSubmit,
        formState: { isDirty, errors },
        setValue,
        watch,
        clearErrors,
    } = methods;

    const date = watch("dateIssued");

    const { fields, append, remove } = useFieldArray({
        control,
        name: "employees",
    });

    useEffect(() => {
        reset(defaultValues);
    }, [isEdit, currentRegistered]);

    useEffect(() => {
        const scContentEl = scrollbarRef.current?.contentEl;
        if (scContentEl && scContentEl.scrollHeight > 281) {
            sleep(225).then(() => {
                scContentEl.scrollIntoView({
                    block: "end",
                    behavior: "smooth",
                    inline: "end",
                });
            });
        }
    }, [fields]);

    const handleRemove = (index) => () => {
        remove(index);
    };

    const handleAutocompleteName = (_, val) => {
        if (val) {
            setAutoCompleteVal(val);
            setAutoCompleteInputVal(val.fullname);
            if (autoCompleteErr.employee) {
                setAutoCompleteErr((c) => ({
                    ...c,
                    employee: null,
                }));
            }
            if (!!errors?.employees?.message) {
                clearErrors("employees");
            }
        } else {
            setAutoCompleteVal({
                fullname: "",
                emp_id: "",
                position: "",
            });
            setAutoCompleteInputVal("");
        }
    };

    const handleAutoCompleteInputChange = (e, val) => {
        if (e?.type === "change") {
            setAutoCompleteInputVal(val ?? "");
        }
    };

    const handleTrainerChange = (e) => {
        setTrainerVal(e.target.value);
        if (autoCompleteErr.trainer) {
            setAutoCompleteErr((c) => ({
                ...c,
                trainer: null,
            }));
        }
    };

    const handleWitnessChange = (e) => {
        setWitnessVal(e.target.value);
        if (autoCompleteErr.witness) {
            setAutoCompleteErr((c) => ({
                ...c,
                witness: null,
            }));
        }
    };

    const handleClose = () => {
        onClose();
        reset();
        setTrainerVal("");
        setWitnessVal("");
        setAutoCompleteErr({
            employee: null,
            trainer: null,
            witness: null,
        });
        setAutoCompleteVal({
            fullname: "",
            emp_id: "",
            position: "",
            img: "",
        });
        setAutoCompleteInputVal("");
    };

    const handleAdd = () => {
        const errorMessages = {
            trainer: null,
            witness: null,
            employee: null,
        };
        let hasError = false;
        if (!witnessVal) {
            errorMessages.witness = "Please add a witness";
            hasError = true;
        }
        if (!trainerVal) {
            errorMessages.trainer = "Please add a trainer";
            hasError = true;
        }
        if (!autoCompleteVal.emp_id) {
            errorMessages.employee = "Please add an employee";
            hasError = true;
        }
        if (hasError) {
            setAutoCompleteErr(errorMessages);
        } else {
            setAutoCompleteVal({
                emp_id: "",
                position: "",
                fullname: "",
                img: "",
            });
            setAutoCompleteInputVal("");
            append({
                emp_id: autoCompleteVal.emp_id,
                position: autoCompleteVal.position,
                fullname: autoCompleteVal.fullname,
                img: autoCompleteVal.img,
                trainer: trainerVal,
                witness: witnessVal,
            });
        }
    };

    const onSubmit = (data) => {
        const employees = data.employees.map((emp) => ({
            emp_id: emp.emp_id,
            trainer: emp.trainer,
            witness: emp.witness,
        }));
        Inertia.post(
            route("toolboxtalk.management.preplanning.assignEmployee"),
            {
                ...data,
                employees,
                dateIssued: format(data.dateIssued, "yyyy-MM-dd"),
            },
            {
                onStart() {
                    handleClose();
                    load("Assigning employee", "Please wait...");
                },
                onFinish() {
                    stop();
                    queryClient.invalidateQueries({
                        queryKey: [
                            "toolboxtalks.preplanning.tbtDailies",
                            user.subscriber_id,
                        ],
                    });
                },
            }
        );
    };

    const onEdit = (data) => {
        if (isEdit && currentRegistered) {
            const employees = data.employees.map((emp) => ({
                emp_id: emp.emp_id,
                trainer: emp.trainer,
                witness: emp.witness,
            }));
            Inertia.post(
                route(
                    "toolboxtalk.management.preplanning.editAssignedEmployee",
                    currentRegistered.id
                ),
                {
                    ...data,
                    employees,
                    dateIssued: format(data.dateIssued, "yyyy-MM-dd"),
                },
                {
                    onStart() {
                        handleClose();
                        load("Assigning employee", "Please wait...");
                    },
                    onFinish() {
                        stop();
                        queryClient.invalidateQueries({
                            queryKey: [
                                "toolboxtalks.preplanning.tbtDailies",
                                user.subscriber_id,
                            ],
                        });
                    },
                }
            );
        }
    };

    return (
        <Portal>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={handleClose}
                scroll="body"
                {...other}
            >
                <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
                    {title}
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        pt: 1,
                        pb: 0,
                        border: "none",
                        minHeight: 600,
                        maxHeight: 600,
                        mt: !!errors.date?.message ? 2.5 : 0,
                    }}
                >
                    <Stack spacing={2}>
                        <FormProvider methods={methods}>
                            <Stack
                                divider={
                                    <Divider
                                        flexItem
                                        sx={{ borderStyle: "dashed" }}
                                    />
                                }
                                spacing={1.5}
                            >
                                <Stack mb={1.5} spacing={1.5}>
                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={1.5}
                                        sx={{ width: 1 }}
                                    >
                                        <RHFMuiSelect
                                            size="small"
                                            label="Project Code"
                                            name="project_code"
                                            fullWidth
                                            options={
                                                projectDetails["Project Code"]
                                                    ? [
                                                          {
                                                              label: "",
                                                              value: "",
                                                          },
                                                          ...projectDetails[
                                                              "Project Code"
                                                          ].map((d) => ({
                                                              label:
                                                                  d.value +
                                                                  (d.name
                                                                      ? ` (${d.name})`
                                                                      : ""),
                                                              value: d.value,
                                                          })),
                                                      ]
                                                    : []
                                            }
                                        />

                                        <RHFMuiSelect
                                            size="small"
                                            label="Originator"
                                            name="originator"
                                            fullWidth
                                            options={
                                                projectDetails["Originator"]
                                                    ? [
                                                          {
                                                              label: "",
                                                              value: "",
                                                          },
                                                          ...projectDetails[
                                                              "Originator"
                                                          ].map((d) => ({
                                                              label:
                                                                  d.value +
                                                                  (d.name
                                                                      ? ` (${d.name})`
                                                                      : ""),
                                                              value: d.value,
                                                          })),
                                                      ]
                                                    : []
                                            }
                                        />

                                        <RHFMuiSelect
                                            size="small"
                                            label="Discipline"
                                            name="discipline"
                                            fullWidth
                                            options={
                                                projectDetails["Discipline"]
                                                    ? [
                                                          {
                                                              label: "",
                                                              value: "",
                                                          },
                                                          ...projectDetails[
                                                              "Discipline"
                                                          ].map((d) => ({
                                                              label:
                                                                  d.value +
                                                                  (d.name
                                                                      ? ` (${d.name})`
                                                                      : ""),
                                                              value: d.value,
                                                          })),
                                                      ]
                                                    : []
                                            }
                                        />
                                    </Stack>

                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={1.5}
                                        sx={{ width: 1 }}
                                    >
                                        <Stack
                                            direction={{
                                                xs: "column",
                                                md: "row",
                                            }}
                                            spacing={1.5}
                                            sx={{ width: 1 }}
                                        >
                                            <RHFMuiSelect
                                                size="small"
                                                label="Type"
                                                name="document_type"
                                                fullWidth
                                                options={
                                                    projectDetails["Type"]
                                                        ? [
                                                              {
                                                                  label: "",
                                                                  value: "",
                                                              },
                                                              ...projectDetails[
                                                                  "Type"
                                                              ].map((d) => ({
                                                                  label:
                                                                      d.value +
                                                                      (d.name
                                                                          ? ` (${d.name})`
                                                                          : ""),
                                                                  value: d.value,
                                                              })),
                                                          ]
                                                        : []
                                                }
                                            />

                                            <TextField
                                                disabled
                                                size="small"
                                                fullWidth
                                                label="Sequence No."
                                                value={
                                                    isEdit &&
                                                    currentRegistered?.sequenceNo
                                                        ? currentRegistered.sequenceNo
                                                        : sequenceNo
                                                }
                                            />
                                            <Box width={1} />
                                        </Stack>
                                    </Stack>
                                </Stack>

                                <Stack mb={1.5} spacing={1.5}>
                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={1.5}
                                        sx={{ width: 1 }}
                                    >
                                        <RHFMuiSelect
                                            size="small"
                                            label="Location"
                                            name="location"
                                            fullWidth
                                            options={
                                                projectDetails["Location"]
                                                    ? [
                                                          {
                                                              label: "",
                                                              value: "",
                                                          },
                                                          ...projectDetails[
                                                              "Location"
                                                          ].map((d) => ({
                                                              label:
                                                                  d.value +
                                                                  (d.name
                                                                      ? ` (${d.name})`
                                                                      : ""),
                                                              value: d.value,
                                                          })),
                                                      ]
                                                    : []
                                            }
                                        />

                                        <RHFTextField
                                            size="small"
                                            name="exact_location"
                                            label="Exact Location"
                                            fullWidth
                                        />

                                        <Stack width={1}>
                                            <DatePicker
                                                label="TBT Date"
                                                value={date}
                                                onChange={(val) =>
                                                    setValue("dateIssued", val)
                                                }
                                                minDate={
                                                    isEdit &&
                                                    currentRegistered?.date_issued
                                                        ? new Date(
                                                              currentRegistered.date_issued
                                                          )
                                                        : TOMORROW
                                                }
                                                inputFormat="M/d/yyyy"
                                                disableMaskedInput
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                            {!!errors.dateIssued?.message && (
                                                <FormHelperText
                                                    error
                                                    sx={{
                                                        paddingLeft: 1.5,
                                                    }}
                                                >
                                                    {errors.dateIssued.message}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack mb={1.5} spacing={1.5}>
                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={1.5}
                                        sx={{ width: 1 }}
                                    >
                                        <Stack width={1} sx={{ flex: 0.5 }}>
                                            <Autocomplete
                                                id="virtualize-employee-list"
                                                value={autoCompleteVal}
                                                options={employeeList.filter(
                                                    (emp) =>
                                                        !fields.some(
                                                            (f) =>
                                                                f?.emp_id ===
                                                                emp.emp_id
                                                        )
                                                )}
                                                onChange={
                                                    handleAutocompleteName
                                                }
                                                inputValue={
                                                    autoCompleteInputVal
                                                }
                                                onInputChange={
                                                    handleAutoCompleteInputChange
                                                }
                                                fullWidth
                                                disableListWrap
                                                PopperComponent={StyledPopper}
                                                ListboxComponent={
                                                    ListboxComponent
                                                }
                                                getOptionLabel={(opt) =>
                                                    opt.fullname
                                                }
                                                isOptionEqualToValue={(
                                                    opt,
                                                    val
                                                ) => {
                                                    if (val.emp_id === "")
                                                        return false;
                                                    return (
                                                        opt.emp_id ===
                                                        val.emp_id
                                                    );
                                                }}
                                                renderOption={(
                                                    props,
                                                    option,
                                                    state
                                                ) => [
                                                    props,
                                                    option,
                                                    state.index,
                                                ]}
                                                renderInput={(params) => {
                                                    return (
                                                        <TextField
                                                            error={
                                                                !!autoCompleteErr.employee ||
                                                                !!errors
                                                                    ?.employees
                                                                    ?.message
                                                            }
                                                            label="Choose employee"
                                                            {...params}
                                                            size="small"
                                                        />
                                                    );
                                                }}
                                            />
                                            {!!errors?.employees?.message && (
                                                <FormHelperText
                                                    error
                                                    sx={{ paddingLeft: 1.5 }}
                                                >
                                                    {errors.employees.message}
                                                </FormHelperText>
                                            )}
                                            {!!autoCompleteErr.employee && (
                                                <FormHelperText
                                                    error
                                                    sx={{ paddingLeft: 1.5 }}
                                                >
                                                    {autoCompleteErr.employee}
                                                </FormHelperText>
                                            )}
                                        </Stack>

                                        <Stack sx={{ flex: 0.25 }}>
                                            <TextField
                                                size="small"
                                                name="trainer"
                                                label="Trainer"
                                                value={trainerVal}
                                                onChange={handleTrainerChange}
                                                fullWidth
                                                error={
                                                    !!autoCompleteErr.trainer
                                                }
                                            />
                                            {!!autoCompleteErr.trainer && (
                                                <FormHelperText
                                                    error
                                                    sx={{ paddingLeft: 1.5 }}
                                                >
                                                    {autoCompleteErr.trainer}
                                                </FormHelperText>
                                            )}
                                        </Stack>

                                        <Stack sx={{ flex: 0.25 }}>
                                            <TextField
                                                size="small"
                                                name="witness"
                                                label="Witness"
                                                value={witnessVal}
                                                onChange={handleWitnessChange}
                                                fullWidth
                                                error={
                                                    !!autoCompleteErr.witness
                                                }
                                            />
                                            {!!autoCompleteErr.witness && (
                                                <FormHelperText
                                                    error
                                                    sx={{ paddingLeft: 1.5 }}
                                                >
                                                    {autoCompleteErr.witness}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                        <Button
                                            color="success"
                                            sx={{
                                                flexShrink: 0,
                                                alignSelf: "flex-start",
                                            }}
                                            onClick={handleAdd}
                                        >
                                            Add
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </FormProvider>
                        <TableContainer component={Paper}>
                            <Scrollbar
                                sx={{ maxHeight: 281 }}
                                forceVisible="y"
                                autoHide={false}
                                ref={scrollbarRef}
                            >
                                <Table
                                    stickyHeader
                                    size="small"
                                    sx={{ px: 1.25 }}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Employee Name</TableCell>
                                            <TableCell>Position</TableCell>
                                            <TableCell>Trainer</TableCell>
                                            <TableCell>Witness</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fields.map((row, index) => (
                                            <TableRow
                                                key={row.id}
                                                hover
                                                sx={{
                                                    "& td, & th": {
                                                        borderBottom: 1,
                                                    },
                                                    cursor: "pointer",
                                                }}
                                                onClick={handleRemove(index)}
                                            >
                                                <TableCell>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={1}
                                                    >
                                                        <Avatar
                                                            alt={row.fullname}
                                                            src={row.img}
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                            }}
                                                        />

                                                        <Typography
                                                            variant="subtitle2"
                                                            noWrap
                                                            sx={{
                                                                marginLeft: 1,
                                                            }}
                                                        >
                                                            {row.fullname}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    {row.position}
                                                </TableCell>
                                                <TableCell>
                                                    {row.trainer}
                                                </TableCell>
                                                <TableCell>
                                                    {row.witness}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Remove">
                                                        <IconButton color="error">
                                                            <Iconify icon="material-symbols:close-small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {!fields.length && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={12}
                                                    sx={{ p: 0 }}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        gutterBottom
                                                        sx={{
                                                            color: "text.disabled",
                                                        }}
                                                        align="center"
                                                        pt={1}
                                                    >
                                                        Add an employee.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </TableContainer>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        flexGrow={1}
                    >
                        <Button
                            disabled={!isDirty}
                            variant="soft"
                            onClick={handleSubmit(
                                isEdit && currentRegistered ? onEdit : onSubmit
                            )}
                        >
                            Save
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </Portal>
    );
};

RegisterEmployeePortal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    isEdit: PropTypes.bool,
    currentRegistered: PropTypes.object,
    employeeList: PropTypes.array,
    projectDetails: PropTypes.object,
    sequenceNo: PropTypes.string,
};

export default RegisterEmployeePortal;
