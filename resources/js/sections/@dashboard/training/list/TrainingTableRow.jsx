import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
    Button,
    TableRow,
    Checkbox,
    MenuItem,
    TableCell,
    IconButton,
    Divider,
    Stack,
    Collapse,
    Box,
    Table,
    TableHead,
    TableBody,
} from "@mui/material";
// utils
import { fDate } from "@/utils/formatTime";
// components
import Label from "@/Components/label";
import Iconify from "@/Components/iconify";
import MenuPopover from "@/Components/menu-popover";
import ConfirmDialog from "@/Components/confirm-dialog";
import { Link } from "@inertiajs/inertia-react";

// ----------------------------------------------------------------------

TrainingTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onSelectRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    url: PropTypes.string,
};

export default function TrainingTableRow({
    row,
    selected,
    onSelectRow,
    onDeleteRow,
    url,
    canEdit,
    canDelete,
}) {
    const {
        cms,
        course,
        title,
        trainees_count,
        training_date,
        date_expired,
        status,
        completed,
    } = row;

    const [openCollapse, setOpenCollapse] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [openPopover, setOpenPopover] = useState(null);

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    const handleTriggerCollapse = () => {
        setOpenCollapse((currState) => !currState);
    };
    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell onClick={handleTriggerCollapse} padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    sx={{ whiteSpace: "nowrap", textTransform: "uppercase" }}
                >
                    {cms}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {course ? course.course_name : title}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    sx={{ whiteSpace: "nowrap" }}
                    align="center"
                >
                    {trainees_count}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {fDate(training_date)}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {fDate(date_expired)}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    sx={{ whiteSpace: "nowrap" }}
                >
                    <Label
                        variant="soft"
                        color={completed ? "success" : "warning"}
                    >
                        {completed ? "Complete" : "Incomplete"}
                    </Label>
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    sx={{ whiteSpace: "nowrap" }}
                    align="center"
                >
                    <Label variant="soft" color={status.color}>
                        {status.text}
                    </Label>
                </TableCell>

                <TableCell>
                    <Stack flexDirection="row">
                        <IconButton
                            aria-label="expand row"
                            color={openCollapse ? "inherit" : "default"}
                            onClick={handleTriggerCollapse}
                        >
                            <Iconify
                                icon={
                                    openCollapse
                                        ? "material-symbols:keyboard-arrow-up"
                                        : "material-symbols:keyboard-arrow-down"
                                }
                            />
                        </IconButton>
                        <IconButton
                            color={openPopover ? "primary" : "default"}
                            onClick={handleOpenPopover}
                        >
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Stack>
                </TableCell>
            </TableRow>
            <TableSubRow open={openCollapse} row={row} />

            <MenuPopover
                open={openPopover}
                onClose={handleClosePopover}
                arrow="right-top"
                sx={{ width: 140 }}
            >
                <MenuItem
                    component={Link}
                    href={`/dashboard/training/${url}/${row.id}`}
                >
                    <Iconify icon="eva:eye-fill" />
                    View
                </MenuItem>
                {canEdit && (
                    <MenuItem
                        component={Link}
                        href={`/dashboard/training/${row.id}/edit`}
                    >
                        <Iconify icon="eva:edit-fill" />
                        Edit
                    </MenuItem>
                )}

                {canDelete && (
                    <>
                        <Divider sx={{ borderStyle: "dashed" }} />
                        <MenuItem
                            onClick={() => {
                                handleOpenConfirm();
                                handleClosePopover();
                            }}
                            sx={{ color: "error.main" }}
                        >
                            <Iconify icon="eva:trash-2-outline" />
                            Delete
                        </MenuItem>
                    </>
                )}
            </MenuPopover>

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onDeleteRow}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}

function TableSubRow({ open = false, row }) {
    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Submitted By</TableCell>
                                    <TableCell>Conducted By</TableCell>
                                    <TableCell>Contract No.</TableCell>
                                    <TableCell>Training Location</TableCell>
                                    <TableCell>Training Hours</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        {row?.user_employee?.fullname ??
                                            "Not found"}
                                    </TableCell>
                                    <TableCell>{row.trainer}</TableCell>
                                    <TableCell>{row.contract_no}</TableCell>
                                    <TableCell>{row.location}</TableCell>
                                    <TableCell>{row.training_hrs}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
}
