import { ListboxComponent } from "@/Components/auto-complete";
import { yupResolver } from "@hookform/resolvers/yup";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Popper from "@mui/material/Popper";
import Portal from "@mui/material/Portal";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";

import { RHFMuiSelect } from "@/Components/hook-form";
import FormProvider from "@/Components/hook-form/FormProvider";
import Iconify from "@/Components/iconify";
import { useSwal } from "@/hooks/useSwal";
import { sleep } from "@/lib/utils";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import EmployeeTableList from "./EmployeeTableList";

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
    projectDetails = {},
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

    const [locationVal, setLocationVal] = useState("");
    const [autoCompleteErr, setAutoCompleteErr] = useState({
        employee: null,
        reviewer: null,
        verifier: null,
        location: null,
        exactLocation: null,
    });
    const [autoCompleteVal, setAutoCompleteVal] = useState({
        fullname: "",
        emp_id: "",
        position: "",
        img: "",
    });
    const [autoCompleteInputVal, setAutoCompleteInputVal] = useState("");
    const [autoCompleteReviewerVal, setAutoCompleteReviewerVal] = useState({
        fullname: "",
        emp_id: "",
        position: "",
        img: "",
    });
    const [autoCompleteInputReviewerVal, setAutoCompleteInputReviewerVal] =
        useState("");
    const [autoCompleteVerifierVal, setAutoCompleteVerifierVal] = useState({
        fullname: "",
        emp_id: "",
        position: "",
        img: "",
    });
    const [autoCompleteInputVerifierVal, setAutoCompleteInputVerifierVal] =
        useState("");

    const defaultValues = {
        employees: currentRegistered?.tracker_employees ?? [],
        dateAssigned: currentRegistered?.date_assigned
            ? new Date(currentRegistered.date_assigned)
            : TOMORROW,
        originator: currentRegistered?.originator ?? "",
        project_code: currentRegistered?.project_code ?? "",
        discipline: currentRegistered?.discipline ?? "",
        document_type: currentRegistered?.document_type ?? "",
    };

    const schema = useMemo(
        () =>
            Yup.object().shape({
                originator: Yup.string().required("Please add originator."),
                project_code: Yup.string().required("Please add project_code."),
                discipline: Yup.string().required("Please add discipline."),
                document_type: Yup.string().required(
                    "Please add document type."
                ),
                dateAssigned: Yup.date()
                    .min(
                        isEdit && currentRegistered?.date_assigned
                            ? new Date(currentRegistered.date_assigned)
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
                            reviewer: Yup.object().shape({
                                emp_id: Yup.string().required(
                                    "Please select a valid employee."
                                ),
                                position: Yup.string(),
                            }),
                            verifier: Yup.object().shape({
                                emp_id: Yup.string().required(
                                    "Please select a valid employee."
                                ),
                                position: Yup.string(),
                            }),
                            location: Yup.string(),
                        })
                    ),
            }),
        [currentRegistered?.date_assigned, isEdit]
    );

    const methods = useForm({
        resolver: yupResolver(schema),
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

    const date = watch("dateAssigned");

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

    const handleAutocompleteReviewer = (_, val) => {
        if (val) {
            setAutoCompleteReviewerVal(val);
            setAutoCompleteInputReviewerVal(val.fullname);
            if (autoCompleteErr.reviewer) {
                setAutoCompleteErr((c) => ({
                    ...c,
                    reviewer: null,
                }));
            }
            if (!!errors?.employees?.message) {
                clearErrors("employees");
            }
        } else {
            setAutoCompleteReviewerVal({
                fullname: "",
                emp_id: "",
                position: "",
            });
            setAutoCompleteInputReviewerVal("");
        }
    };

    const handleAutoCompleteReviewerInputChange = (e, val) => {
        if (e?.type === "change") {
            setAutoCompleteInputReviewerVal(val ?? "");
        }
    };

    const handleAutocompleteVerifier = (_, val) => {
        if (val) {
            setAutoCompleteVerifierVal(val);
            setAutoCompleteInputVerifierVal(val.fullname);
            if (autoCompleteErr.verifier) {
                setAutoCompleteErr((c) => ({
                    ...c,
                    verifier: null,
                }));
            }
            if (!!errors?.employees?.message) {
                clearErrors("employees");
            }
        } else {
            setAutoCompleteVerifierVal({
                fullname: "",
                emp_id: "",
                position: "",
            });
            setAutoCompleteInputVerifierVal("");
        }
    };

    const handleAutoCompleteVerifierInputChange = (e, val) => {
        if (e?.type === "change") {
            setAutoCompleteInputVerifierVal(val ?? "");
        }
    };

    const handleLocationChange = (e) => {
        const value = e.target.value;
        if (value) {
            setLocationVal(value);
            if (autoCompleteErr.location) {
                setAutoCompleteErr((c) => ({
                    ...c,
                    location: null,
                }));
            }
        }
    };

    const handleAdd = () => {
        const errorMessages = {
            employee: null,
            reviewer: null,
            verifier: null,
            location: null,
        };
        let hasError = false;

        if (!autoCompleteReviewerVal.emp_id) {
            errorMessages.reviewer = "Please add a reviewer";
            hasError = true;
        }
        if (!autoCompleteVerifierVal.emp_id) {
            errorMessages.verifier = "Please add a verifier";
            hasError = true;
        }
        if (!autoCompleteVal.emp_id) {
            errorMessages.employee = "Please add an employee";
            hasError = true;
        }
        if (!locationVal) {
            errorMessages.location = "Please add a location";
            hasError = true;
        }

        if (hasError) {
            setAutoCompleteErr(errorMessages);
        } else {
            append({
                emp_id: autoCompleteVal.emp_id,
                position: autoCompleteVal.position,
                fullname: autoCompleteVal.fullname,
                img: autoCompleteVal.img,
                reviewer: autoCompleteReviewerVal,
                verifier: autoCompleteVerifierVal,
                location: locationVal,
            });
            setAutoCompleteVal({
                emp_id: "",
                position: "",
                fullname: "",
                img: "",
            });
            setAutoCompleteInputVal("");
            setAutoCompleteReviewerVal({
                emp_id: "",
                position: "",
                fullname: "",
                img: "",
            });
            setAutoCompleteInputReviewerVal("");
            setAutoCompleteVerifierVal({
                emp_id: "",
                position: "",
                fullname: "",
                img: "",
            });
            setAutoCompleteInputVerifierVal("");
        }
    };

    const handleRemove = useCallback((index) => () => {
        remove(index);
    });

    const handleUpdateRow = useCallback((index) => () => {
        const selectedRow = fields?.[index];
        if (selectedRow) {
            setAutoCompleteVal({
                emp_id: selectedRow?.emp_id || "",
                position: selectedRow?.position || "",
                fullname: selectedRow?.fullname || "",
                img: selectedRow?.img || "",
            });
            setReviewerVal(selectedRow?.reviewer || "");
            setLocationVal(selectedRow?.location);
            setAutoCompleteInputVal(selectedRow?.fullname);
            remove(index);
        }
    });

    const onSubmit = (data) => {
        const employees = data.employees.map((emp) => ({
            emp_id: emp.emp_id,
            location: emp.location,
            action_id: emp.reviewer.emp_id,
            verifier_id: emp.verifier.emp_id,
        }));
        Inertia.post(
            route("inspection.management.tracker.store"),
            {
                ...data,
                employees,
                dateAssigned: format(data.dateAssigned, "yyyy-MM-dd"),
            },
            {
                onStart() {
                    resetForm();
                    handleClose();
                    load("Assigning employee", "Please wait...");
                },
                onFinish() {
                    stop();
                    queryClient.invalidateQueries({
                        queryKey: ["inspections.tracker", user.subscriber_id],
                    });
                },
            }
        );
    };

    const onEdit = (data) => {
        if (isEdit && currentRegistered) {
            const employees = data.employees.map((emp) => ({
                emp_id: emp.emp_id,
                location: emp.location,
                action_id: emp.reviewer.emp_id,
                verifier_id: emp.verifier.emp_id,
            }));
            Inertia.post(
                route(
                    "inspection.management.tracker.update",
                    currentRegistered.id
                ),
                {
                    ...data,
                    employees,
                    dateAssigned: format(data.dateAssigned, "yyyy-MM-dd"),
                },
                {
                    onStart() {
                        resetForm();
                        handleClose();
                        load("Assigning employee", "Please wait...");
                    },
                    onFinish() {
                        stop();
                        queryClient.invalidateQueries({
                            queryKey: [
                                "inspections.tracker",
                                user.subscriber_id,
                            ],
                        });
                    },
                }
            );
        }
    };

    const handleClose = (_event, reason) => {
        if (reason && reason === "backdropClick") return;
        onClose();
        resetForm();
    };

    const resetForm = () => {
        reset();
        setLocationVal("");
        setAutoCompleteErr({
            employee: null,
            location: null,
            reviewer: null,
            verifier: null,
        });
        setAutoCompleteVal({
            fullname: "",
            emp_id: "",
            position: "",
            img: "",
        });
        setAutoCompleteInputVal("");
        setAutoCompleteReviewerVal({
            fullname: "",
            emp_id: "",
            position: "",
            img: "",
        });
        setAutoCompleteInputReviewerVal("");
        setAutoCompleteVerifierVal({
            fullname: "",
            emp_id: "",
            position: "",
            img: "",
        });
        setAutoCompleteInputVerifierVal("");
    };

    const empWithUsers = useMemo(
        () => employeeList.filter((emp) => emp.user_id),
        [employeeList]
    );

    return (
        <Portal>
            <Dialog
                fullWidth
                maxWidth="lg"
                open={open}
                onClose={handleClose}
                scroll="body"
                {...other}
            >
                <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
                    {title}
                </DialogTitle>

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Iconify icon="ic:baseline-close" />
                </IconButton>

                <DialogContent
                    dividers
                    sx={{
                        pt: 1,
                        pb: 0,
                        border: "none",
                        minHeight: 600,
                        maxHeight: 600,
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
                                                    currentRegistered?.sequence_no
                                                        ? currentRegistered.sequence_no
                                                        : sequenceNo
                                                }
                                            />
                                            <Stack width={1}>
                                                <DatePicker
                                                    label="Inspection Date"
                                                    value={date}
                                                    onChange={(val) =>
                                                        setValue(
                                                            "dateAssigned",
                                                            val
                                                        )
                                                    }
                                                    minDate={
                                                        isEdit &&
                                                        currentRegistered?.date_assigned
                                                            ? new Date(
                                                                  currentRegistered.date_assigned
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
                                                {!!errors.dateAssigned
                                                    ?.message && (
                                                    <FormHelperText
                                                        error
                                                        sx={{
                                                            paddingLeft: 1.5,
                                                        }}
                                                    >
                                                        {
                                                            errors.dateAssigned
                                                                .message
                                                        }
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack mb={1.5} spacing={1.5}>
                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={1.5}
                                        sx={{ width: 1 }}
                                    >
                                        <Stack width={1}>
                                            <Autocomplete
                                                id="virtualize-employee-list"
                                                value={autoCompleteVal}
                                                options={empWithUsers.filter(
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
                                                    opt.fullname ?? ""
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

                                        <Stack width={1}>
                                            <Autocomplete
                                                id="virtualize-reviewer-employee-list"
                                                value={autoCompleteReviewerVal}
                                                options={empWithUsers.filter(
                                                    (emp) =>
                                                        !fields.some(
                                                            (f) =>
                                                                f?.emp_id ===
                                                                emp.emp_id
                                                        )
                                                )}
                                                onChange={
                                                    handleAutocompleteReviewer
                                                }
                                                inputValue={
                                                    autoCompleteInputReviewerVal
                                                }
                                                onInputChange={
                                                    handleAutoCompleteReviewerInputChange
                                                }
                                                fullWidth
                                                disableListWrap
                                                PopperComponent={StyledPopper}
                                                ListboxComponent={
                                                    ListboxComponent
                                                }
                                                getOptionLabel={(opt) =>
                                                    opt.fullname ?? ""
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
                                                                !!autoCompleteErr.reviewer ||
                                                                !!errors
                                                                    ?.employees
                                                                    ?.message
                                                            }
                                                            label="Choose reviewer"
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
                                            {!!autoCompleteErr.reviewer && (
                                                <FormHelperText
                                                    error
                                                    sx={{ paddingLeft: 1.5 }}
                                                >
                                                    {autoCompleteErr.reviewer}
                                                </FormHelperText>
                                            )}
                                        </Stack>

                                        <Stack width={1}>
                                            <Autocomplete
                                                id="virtualize-verifier-employee-list"
                                                value={autoCompleteVerifierVal}
                                                options={empWithUsers.filter(
                                                    (emp) =>
                                                        !fields.some(
                                                            (f) =>
                                                                f?.emp_id ===
                                                                emp.emp_id
                                                        )
                                                )}
                                                onChange={
                                                    handleAutocompleteVerifier
                                                }
                                                inputValue={
                                                    autoCompleteInputVerifierVal
                                                }
                                                onInputChange={
                                                    handleAutoCompleteVerifierInputChange
                                                }
                                                fullWidth
                                                disableListWrap
                                                PopperComponent={StyledPopper}
                                                ListboxComponent={
                                                    ListboxComponent
                                                }
                                                getOptionLabel={(opt) =>
                                                    opt.fullname ?? ""
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
                                                                !!autoCompleteErr.verifier ||
                                                                !!errors
                                                                    ?.employees
                                                                    ?.message
                                                            }
                                                            label="Choose verifier"
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
                                            {!!autoCompleteErr.verifier && (
                                                <FormHelperText
                                                    error
                                                    sx={{ paddingLeft: 1.5 }}
                                                >
                                                    {autoCompleteErr.verifier}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={1.5}
                                        sx={{ width: 1 }}
                                    >
                                        <Stack sx={{ width: 1 }}>
                                            <FormControl
                                                error={
                                                    !!autoCompleteErr.location
                                                }
                                                size="small"
                                            >
                                                <InputLabel
                                                    id={"select-location"}
                                                >
                                                    Location
                                                </InputLabel>
                                                <Select
                                                    labelId={"select-location"}
                                                    id={"select-location"}
                                                    value={locationVal}
                                                    label="Location"
                                                    onChange={
                                                        handleLocationChange
                                                    }
                                                    size="small"
                                                >
                                                    {(projectDetails["Location"]
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
                                                    ).map((opt, idx) => (
                                                        <MenuItem
                                                            disabled={
                                                                !!opt?.disabled
                                                            }
                                                            sx={{
                                                                height: 36,
                                                            }}
                                                            key={idx}
                                                            value={
                                                                opt.value || ""
                                                            }
                                                        >
                                                            {opt?.label || ""}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {!!autoCompleteErr.location && (
                                                <FormHelperText
                                                    error
                                                    sx={{ paddingLeft: 1.5 }}
                                                >
                                                    {autoCompleteErr.location}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Stack>
                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={1.5}
                                        sx={{ width: 1 }}
                                    >
                                        <Button
                                            color="success"
                                            sx={{
                                                flexShrink: 0,
                                                alignSelf: "flex-start",
                                            }}
                                            variant="contained"
                                            fullWidth
                                            onClick={handleAdd}
                                        >
                                            Add
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </FormProvider>

                        <EmployeeTableList
                            list={fields}
                            onRemove={handleRemove}
                            onUpdate={handleUpdateRow}
                            ref={scrollbarRef}
                        />
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

export default memo(RegisterEmployeePortal);
