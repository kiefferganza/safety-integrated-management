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
import IconButton from "@mui/material/IconButton";
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
import PropTypes from "prop-types";
import { useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";

import Scrollbar from "@/Components/scrollbar";
import { useSwal } from "@/hooks/useSwal";
import { sleep } from "@/lib/utils";
import { Inertia } from "@inertiajs/inertia";
import Avatar from "@mui/material/Avatar";
import { addDays, format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePage } from "@inertiajs/inertia-react";
import { RHFMuiSelect } from "@/Components/hook-form";
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

const Box1 = styled(Box)(({ theme }) => ({
    flex: 0.6,
}));

const Box2 = styled(Box)(({ theme }) => ({
    flex: 0.4,
}));

const RegisterEmployeeSchema = Yup.object().shape({
    location: Yup.string().required("Please add a location."),
    employees: Yup.array()
        .min(1, "Add at least one employee")
        .of(
            Yup.object().shape({
                emp_id: Yup.string().required(
                    "Please select a valid employee."
                ),
                position: Yup.string(),
            })
        ),
});

const RegisterEmployeePortal = ({
    title = "Assign Employee's",
    open,
    onClose,
    isEdit = false,
    locationList = [],
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
    const [autoCompleteInputVal, setAutoCompleteInputVal] = useState("");
    const { load, stop } = useSwal();
    const methods = useForm({
        resolver: yupResolver(RegisterEmployeeSchema),
        defaultValues: {
            employees: [],
            location: "",
        },
    });

    const {
        control,
        reset,
        handleSubmit,
        formState: { isDirty },
        setValue,
    } = methods;

    const { fields, replace, remove } = useFieldArray({
        control,
        name: "employees",
    });

    useEffect(() => {
        if (isEdit && currentRegistered) {
            setValue("employees", currentRegistered?.assigned ?? []);
            setValue("location", currentRegistered?.location);
        }
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
        replace(val);
        if (autoCompleteInputVal) {
            setAutoCompleteInputVal("");
        }
    };

    const handleAutoCompleteInputChange = (e, val) => {
        if (e?.type === "change") {
            setAutoCompleteInputVal(val ?? "");
        }
    };

    const handleClose = () => {
        onClose();
        reset();
    };

    const onSubmit = (data) => {
        const employees = data.employees.map((emp) => ({ emp_id: emp.emp_id }));
        Inertia.post(
            route("toolboxtalk.management.preplanning.assignEmployee"),
            { employees, location: data.location },
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
            }));
            Inertia.post(
                route(
                    "toolboxtalk.management.preplanning.editAssignedEmployee",
                    currentRegistered.id
                ),
                { employees, location: data.location },
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
                {...other}
            >
                <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
                    {title} {!isEdit && "for tomorrow"}
                    {!isEdit && (
                        <Typography
                            component="span"
                            display="block"
                            fontStyle="italic"
                        >
                            ({format(addDays(new Date(), 1), "MMM, d yyyy")})
                        </Typography>
                    )}
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        pt: 1,
                        pb: 0,
                        border: "none",
                        minHeight: 348,
                        maxHeight: 348,
                    }}
                >
                    <Stack spacing={2}>
                        <FormProvider methods={methods}>
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                spacing={1.5}
                            >
                                <Box1>
                                    <Autocomplete
                                        sx={{ px: 1.25 }}
                                        id="virtualize-employee-list"
                                        value={fields}
                                        options={employeeList}
                                        onChange={handleAutocompleteName}
                                        inputValue={autoCompleteInputVal}
                                        onInputChange={
                                            handleAutoCompleteInputChange
                                        }
                                        multiple
                                        fullWidth
                                        disableListWrap
                                        PopperComponent={StyledPopper}
                                        ListboxComponent={ListboxComponent}
                                        getOptionLabel={(opt) => opt.fullname}
                                        isOptionEqualToValue={(opt, val) =>
                                            opt.emp_id === val.emp_id
                                        }
                                        renderOption={(
                                            props,
                                            option,
                                            state
                                        ) => [props, option, state.index]}
                                        renderInput={(params) => {
                                            params.InputProps.startAdornment =
                                                undefined;
                                            return (
                                                <TextField
                                                    label="Choose employee"
                                                    {...params}
                                                    size="small"
                                                />
                                            );
                                        }}
                                    />
                                </Box1>
                                <Box2>
                                    <RHFMuiSelect
                                        label="Station/Location."
                                        name="location"
                                        fullWidth
                                        size="small"
                                        options={[
                                            { label: "", value: "" },
                                            ...locationList.map((d) => ({
                                                label:
                                                    d.value +
                                                    (d.name
                                                        ? ` (${d.name})`
                                                        : ""),
                                                value: d.value,
                                            })),
                                        ]}
                                    />
                                </Box2>
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
    locationList: PropTypes.array,
};

export default RegisterEmployeePortal;
