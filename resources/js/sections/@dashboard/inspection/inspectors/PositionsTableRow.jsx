import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
    Button,
    Checkbox,
    TableRow,
    Tooltip,
    TableCell,
    IconButton,
} from "@mui/material";
// components
import Iconify from "@/Components/iconify";
import ConfirmDialog from "@/Components/confirm-dialog";

// ----------------------------------------------------------------------

PositionsTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onDeleteRow: PropTypes.func,
};

export default function PositionsTableRow({
    row,
    index,
    selected,
    onSelectRow,
    onDeleteRow,
}) {
    const [openConfirm, setOpenConfirm] = useState(false);

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

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell align="left">{index}</TableCell>

                <TableCell align="left">{row.position}</TableCell>

                <TableCell align="right">
                    <Tooltip title="Delete">
                        <IconButton onClick={handleOpenConfirm} color="error">
                            <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>

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
