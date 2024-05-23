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

const TYPES = {
    1: "Civil",
    2: "Electrical",
    3: "Mechanical",
    4: "Workshop",
    5: "Office",
};

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

    const [exactLocationVal, setExactLocationVal] = useState("");
    const [locationVal, setLocationVal] = useState("");
    const [tbtTypeVal, setTbtTypeVal] = useState("");
    const [witnessVal, setWitnessVal] = useState("");
    const [autoCompleteErr, setAutoCompleteErr] = useState({
        employee: null,
        witness: null,
        location: null,
        tbtTypeVal: null,
        exactLocation: null,
    });
    const [autoCompleteVal, setAutoCompleteVal] = useState({
        fullname: "",
        emp_id: "",
        position: "",
        img: "",
    });
    const [autoCompleteInputVal, setAutoCompleteInputVal] = useState("");

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
                dateAssigned: Yup.date().required("Please enter a valid date"),
                employees: Yup.array()
                    .min(1, "Add at least one employee")
                    .of(
                        Yup.object().shape({
                            emp_id: Yup.string().required(
                                "Please select a valid employee."
                            ),
                            position: Yup.string(),
                            witness: Yup.string(),
                            location: Yup.string(),
                            tbt_type: Yup.mixed().oneOf(
                                ["1", "2", "3", "4", "5"],
                                "Please select tbt_type"
                            ),
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

    const handleWitnessChange = (e, val) => {
        const valid = e?.type === "change" || e?.type === "click";
        const value = val?.fullname ? val.fullname : val ?? "";
        if (valid) {
            setWitnessVal(value);
            if (autoCompleteErr.witness) {
                setAutoCompleteErr((c) => ({
                    ...c,
                    witness: null,
                }));
            }
        }
    };

    const handleTbtTypeChange = (e) => {
        const value = e.target.value;
        if (value) {
            setTbtTypeVal(value);
            if (autoCompleteErr.tbtType) {
                setAutoCompleteErr((c) => ({
                    ...c,
                    tbtType: null,
                }));
            }
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
            witness: null,
            tbtType: null,
            location: null,
            exactLocation: null,
        };
        let hasError = false;

        if (
            !witnessVal ||
            !employeeList?.some((e) => e.fullname === witnessVal)
        ) {
            errorMessages.witness = "Please add a witness";
        }

        if (!tbtTypeVal) {
            errorMessages.tbtType = "Please add a tbt type";
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

        if (!exactLocationVal) {
            errorMessages.exactLocation = "Please add an exact location";
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
                witness: witnessVal,
                location: locationVal,
                tbt_type: tbtTypeVal,
                exact_location: exactLocationVal,
            });
            setAutoCompleteVal({
                emp_id: "",
                position: "",
                fullname: "",
                img: "",
            });
            setWitnessVal("");
            setAutoCompleteInputVal("");
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
            setWitnessVal(selectedRow?.witness || "");
            setLocationVal(selectedRow?.location);
            setTbtTypeVal(selectedRow?.tbt_type);
            setExactLocationVal(selectedRow?.exact_location);
            setAutoCompleteInputVal(selectedRow?.fullname);
            remove(index);
        }
    });

    const onSubmit = (data) => {
        const employees = data.employees.map((emp) => ({
            emp_id: emp.emp_id,
            location: emp.location,
            tbt_type: emp.tbt_type,
            exact_location: emp.exact_location,
            witness: emp.witness,
        }));
        Inertia.post(
            route("toolboxtalk.management.preplanning.assignEmployee"),
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
                location: emp.location,
                tbt_type: emp.tbt_type,
                exact_location: emp.exact_location,
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
                                "toolboxtalks.preplanning.tbtDailies",
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
        setWitnessVal("");
        setLocationVal("");
        setTbtTypeVal("");
        setExactLocationVal("");
        setAutoCompleteErr({
            tbtType: null,
            employee: null,
            location: null,
            exactLocation: null,
        });
        setAutoCompleteVal({
            fullname: "",
            emp_id: "",
            position: "",
            img: "",
        });
        setAutoCompleteInputVal("");
    };

    const empWithUsers = useMemo(
        () => employeeList.filter((emp) => emp.user_id),
        [employeeList]
    );

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
                                                    label="TBT Date"
                                                    value={date}
                                                    onChange={(val) =>
                                                        setValue(
                                                            "dateAssigned",
                                                            val
                                                        )
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
                                                options={empWithUsers}
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
                                                id="witness-list"
                                                fullWidth
                                                disableListWrap
                                                value={witnessVal}
                                                onChange={handleWitnessChange}
                                                inputValue={witnessVal}
                                                onInputChange={
                                                    handleWitnessChange
                                                }
                                                options={employeeList}
                                                renderOption={(
                                                    props,
                                                    option,
                                                    state
                                                ) => [
                                                    props,
                                                    option,
                                                    state.index,
                                                ]}
                                                isOptionEqualToValue={(
                                                    opt,
                                                    val
                                                ) => opt.fullname === val}
                                                PopperComponent={StyledPopper}
                                                ListboxComponent={
                                                    ListboxComponent
                                                }
                                                getOptionLabel={(opt) =>
                                                    opt?.fullname ?? ""
                                                }
                                                renderInput={(params) => {
                                                    return (
                                                        <TextField
                                                            error={
                                                                !!autoCompleteErr.witness
                                                            }
                                                            label="Choose witness"
                                                            {...params}
                                                            size="small"
                                                        />
                                                    );
                                                }}
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

                                        <Stack sx={{ width: 1 }}>
                                            <TextField
                                                size="small"
                                                label="Exact Location"
                                                value={exactLocationVal}
                                                onChange={(e) => {
                                                    setExactLocationVal(
                                                        e.target.value
                                                    );
                                                    if (
                                                        autoCompleteErr.exactLocation
                                                    ) {
                                                        setAutoCompleteErr(
                                                            (c) => ({
                                                                ...c,
                                                                exactLocation:
                                                                    null,
                                                            })
                                                        );
                                                    }
                                                }}
                                                error={
                                                    !!autoCompleteErr.exactLocation
                                                }
                                                fullWidth
                                            />
                                            {!!autoCompleteErr.exactLocation && (
                                                <FormHelperText
                                                    error
                                                    sx={{ paddingLeft: 1.5 }}
                                                >
                                                    {
                                                        autoCompleteErr.exactLocation
                                                    }
                                                </FormHelperText>
                                            )}
                                        </Stack>

                                        <Stack sx={{ width: 1 }}>
                                            <FormControl
                                                error={
                                                    !!autoCompleteErr.tbtType
                                                }
                                                size="small"
                                            >
                                                <InputLabel
                                                    id={"select-tbt-type"}
                                                >
                                                    TBT Type
                                                </InputLabel>
                                                <Select
                                                    labelId={"select-tbt-type"}
                                                    id={"select-tbt-type"}
                                                    value={tbtTypeVal}
                                                    label="TBT Type"
                                                    onChange={
                                                        handleTbtTypeChange
                                                    }
                                                    size="small"
                                                >
                                                    <MenuItem
                                                        sx={{
                                                            height: 36,
                                                        }}
                                                        value="1"
                                                    >
                                                        {TYPES["1"]}
                                                    </MenuItem>
                                                    <MenuItem
                                                        sx={{
                                                            height: 36,
                                                        }}
                                                        value="2"
                                                    >
                                                        {TYPES["2"]}
                                                    </MenuItem>
                                                    <MenuItem
                                                        sx={{
                                                            height: 36,
                                                        }}
                                                        value="3"
                                                    >
                                                        {TYPES["3"]}
                                                    </MenuItem>
                                                    <MenuItem
                                                        sx={{
                                                            height: 36,
                                                        }}
                                                        value="4"
                                                    >
                                                        {TYPES["4"]}
                                                    </MenuItem>
                                                    <MenuItem
                                                        sx={{
                                                            height: 36,
                                                        }}
                                                        value="5"
                                                    >
                                                        {TYPES["5"]}
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                            {!!autoCompleteErr.tbtType && (
                                                <FormHelperText
                                                    error
                                                    sx={{ paddingLeft: 1.5 }}
                                                >
                                                    {autoCompleteErr.tbtType}
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
