import PropTypes from "prop-types";
import { useState, lazy } from "react";
// @mui
import {
    Button,
    Checkbox,
    TableRow,
    MenuItem,
    TableCell,
    IconButton,
    Divider,
} from "@mui/material";
// utils
import { fDate } from "@/utils/formatTime";
// components
import Iconify from "@/Components/iconify";
import MenuPopover from "@/Components/menu-popover";
import ConfirmDialog from "@/Components/confirm-dialog";
import Label from "@/Components/label";
const InHouseAttachedFile = lazy(() =>
    import("../../portal/InHouseAttachedFile")
);

// ----------------------------------------------------------------------

InHouseRegisterTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onDeleteRow: PropTypes.func,
    onUpdateRow: PropTypes.func,
};

export default function InHouseRegisterTableRow({
    row,
    index,
    selected,
    onSelectRow,
    onDeleteRow,
    onUpdateRow,
}) {
    const [openFiles, setOpenFiles] = useState(false);
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

    const handleOpenFileList = () => {
        handleClosePopover();
        setOpenFiles(true);
    };

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell align="left">{index}</TableCell>

                <TableCell align="left">{row.course_name}</TableCell>

                <TableCell align="left">{row.acronym}</TableCell>

                <TableCell align="left">{fDate(row.created_at)}</TableCell>

                <TableCell align="left">
                    <Label
                        variant="filled"
                        color={row.last_used ? "default" : "success"}
                    >
                        {row.last_used ? "Taken" : "Open"}
                    </Label>
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
                    onClick={() => {
                        onUpdateRow();
                        handleClosePopover();
                    }}
                >
                    <Iconify icon="eva:edit-fill" />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleOpenFileList}>
                    <Iconify icon="heroicons:document-magnifying-glass-20-solid" />
                    View Files
                </MenuItem>

                <Divider />
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
            {openFiles && (
                <InHouseAttachedFile
                    open={openFiles}
                    onClose={() => {
                        setOpenFiles(false);
                    }}
                    training={row}
                />
            )}
        </>
    );
}
