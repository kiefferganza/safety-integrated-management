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
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePage } from "@inertiajs/inertia-react";

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: "border-box",
        "& ul": {
            padding: 0,
            margin: 0,
        },
    },
});

const RegisterEmployeeSchema = Yup.object().shape({
    employees: Yup.array()
        .min(1, "Add at least one employee")
        .of(
            Yup.object().shape({
                emp_id: Yup.string().required("Please select a valid employee"),
                position: Yup.string(),
            })
        ),
});

const RegisterEmployeePortal = ({
    title = "Assign Employee's",
    open,
    onClose,
    isEdit = false,
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
    const methods = useForm({
        resolver: yupResolver(RegisterEmployeeSchema),
        defaultValues: {
            employees: currentRegistered?.employees ?? {},
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
            setValue("employees", currentRegistered?.employees ?? []);
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
    };

    const handleClose = () => {
        onClose();
        reset();
    };

    const onSubmit = (data) => {
        const employees = data.employees.map((emp) => ({ emp_id: emp.emp_id }));
        Inertia.post(
            route("toolboxtalk.management.preplanning.assignEmployee"),
            { employees },
            {
                onStart() {
                    handleClose();
                    load("Assigning employee", "Please wait...");
                },
                onFinish() {
                    stop();
                    queryClient.invalidateQueries({
                        queryKey: [
                            "toolboxtalks.preplanning.register",
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
                { employees },
                {
                    onStart() {
                        handleClose();
                        load("Assigning employee", "Please wait...");
                    },
                    onFinish() {
                        stop();
                        queryClient.invalidateQueries({
                            queryKey: [
                                "toolboxtalks.preplanning.register",
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
                    <Stack spacing={1.5}>
                        <Autocomplete
                            sx={{ px: 1.25 }}
                            id="virtualize-employee-list"
                            value={fields}
                            options={employeeList}
                            onChange={handleAutocompleteName}
                            inputValue=""
                            multiple
                            fullWidth
                            disableListWrap
                            PopperComponent={StyledPopper}
                            ListboxComponent={ListboxComponent}
                            getOptionLabel={(opt) => opt.fullname}
                            isOptionEqualToValue={(opt, val) =>
                                opt.emp_id === val.emp_id
                            }
                            renderOption={(props, option, state) => [
                                props,
                                option,
                                state.index,
                            ]}
                            renderInput={(params) => {
                                params.InputProps.startAdornment = undefined;
                                return (
                                    <TextField
                                        label="Choose employee"
                                        {...params}
                                        size="small"
                                    />
                                );
                            }}
                        />
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
                                                            src={
                                                                row?.profile
                                                                    ?.thumbnail ||
                                                                route("image", {
                                                                    path: "assets/images/default-profile.jpg",
                                                                    w: 32,
                                                                    h: 32,
                                                                    fit: "crop",
                                                                })
                                                            }
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
};

export default RegisterEmployeePortal;
