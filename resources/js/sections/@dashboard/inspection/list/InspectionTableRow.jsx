import PropTypes from "prop-types";
import { useState } from "react";
import { Link, usePage } from "@inertiajs/inertia-react";
import { PATH_DASHBOARD } from "@/routes/paths";
// @mui
import {
    // Link,
    Stack,
    Button,
    Divider,
    Checkbox,
    TableRow,
    MenuItem,
    TableCell,
    IconButton,
    Tooltip,
} from "@mui/material";
// utils
import { fDate } from "@/utils/formatTime";
// components
import Label from "@/Components/label";
import Iconify from "@/Components/iconify";
import MenuPopover from "@/Components/menu-popover";
import ConfirmDialog from "@/Components/confirm-dialog";

// ----------------------------------------------------------------------

InspectionTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
};

export default function InspectionTableRow({
    row,
    selected,
    onSelectRow,
    onDeleteRow,
    canEdit,
    canDelete,
}) {
    const {
        auth: { user },
    } = usePage().props;
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

    const handleDelete = () => {
        handleCloseConfirm();
        onDeleteRow();
    };
    const canEditRow = canEdit && user.emp_id === row.employee_id;
    return (
        <>
            <TableRow hover selected={selected} sx={{ width: 1 }}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell
                    align="left"
                    sx={{ textTransform: "capitalize", whiteSpace: "nowrap" }}
                >
                    {row?.form_number}
                </TableCell>

                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    {row?.inspected_by}
                </TableCell>

                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    {row?.reviewer}
                </TableCell>

                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    {row?.verifier}
                </TableCell>

                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    {row?.date_issued ? fDate(row.date_issued) : ""}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {row?.totalObservation}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {row?.negativeObservation}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {row?.positiveObservation}
                </TableCell>

                <TableCell align="center">
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        gap={1}
                    >
                        <Tooltip title={row?.status?.tooltip}>
                            <Label
                                variant="soft"
                                color={row?.status?.classType}
                            >
                                {row?.status?.text}
                            </Label>
                        </Tooltip>
                        {(row?.type === "verify" || row?.type === "review") && (
                            <Tooltip title={row?.dueStatus?.tooltip}>
                                <Label
                                    variant="soft"
                                    color={row?.dueStatus?.classType}
                                >
                                    {row?.dueStatus?.text}
                                </Label>
                            </Tooltip>
                        )}
                    </Stack>
                </TableCell>

                <TableCell align="right">
                    <IconButton
                        color={openPopover ? "inherit" : "default"}
                        onClick={handleOpenPopover}
                    >
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <MenuPopover
                open={openPopover}
                onClose={handleClosePopover}
                arrow="right-top"
                sx={{ width: 160 }}
            >
                <MenuItem
                    component={Link}
                    href={PATH_DASHBOARD.inspection.view(row.inspection_id)}
                    preserveScroll
                    onClick={handleClosePopover}
                >
                    <Iconify icon="eva:eye-fill" />
                    View
                </MenuItem>
                {row?.type === "submitted" && canEditRow && (
                    <MenuItem
                        component={Link}
                        href={PATH_DASHBOARD.inspection.edit(row.inspection_id)}
                        preserveScroll
                        onClick={handleClosePopover}
                    >
                        <Iconify icon="eva:edit-fill" />
                        Edit
                    </MenuItem>
                )}

                {(row?.type === "review" || row?.type === "submitted") &&
                    row?.reviewer_id === user.emp_id && (
                        <MenuItem
                            component={Link}
                            href={PATH_DASHBOARD.inspection.review(
                                row.inspection_id
                            )}
                            preserveScroll
                            onClick={handleClosePopover}
                        >
                            <Iconify icon="fontisto:preview" />
                            Review
                        </MenuItem>
                    )}

                {row?.type === "verify" && row?.verifier_id === user.emp_id && (
                    <MenuItem
                        component={Link}
                        href={PATH_DASHBOARD.inspection.verify(
                            row.inspection_id
                        )}
                        preserveScroll
                        onClick={handleClosePopover}
                    >
                        <Iconify icon="pajamas:review-checkmark" />
                        Verify
                    </MenuItem>
                )}

                {(user?.emp_id === row?.employee_id ||
                    user?.emp_id === 1 ||
                    canDelete) && (
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
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}
