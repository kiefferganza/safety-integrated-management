import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
    Button,
    Checkbox,
    TableRow,
    MenuItem,
    TableCell,
    IconButton,
} from "@mui/material";
// utils
import { fDate } from "@/utils/formatTime";
// components
import Iconify from "@/Components/iconify";
import MenuPopover from "@/Components/menu-popover";
import ConfirmDialog from "@/Components/confirm-dialog";

// ----------------------------------------------------------------------

RegisterTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onDeleteRow: PropTypes.func,
    onUpdateRow: PropTypes.func,
};

export default function RegisterTableRow({
    row,
    index,
    selected,
    onSelectRow,
    onDeleteRow,
    onUpdateRow,
}) {
    const [openConfirm, setOpenConfirm] = useState(false);

    const [openPopover, setOpenPopover] = useState(null);

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleDeleteRow = () => {
        handleCloseConfirm();
        onDeleteRow();
    };

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell align="left">{index}</TableCell>

                <TableCell align="left">{row.course_name}</TableCell>

                <TableCell align="left">{row?.acronym}</TableCell>

                <TableCell align="left">{fDate(row.created_at)}</TableCell>

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
                    onClick={() => {
                        onUpdateRow();
                        handleClosePopover();
                    }}
                >
                    <Iconify icon="eva:edit-fill" />
                    Edit
                </MenuItem>
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
                        onClick={handleDeleteRow}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}
