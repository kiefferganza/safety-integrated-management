import PropTypes from "prop-types";
import { useState } from "react";
// @mui
const {
    Button,
    Stack,
    Avatar,
    Typography,
    Divider,
    Checkbox,
    TableRow,
    MenuItem,
    TableCell,
    IconButton,
    Collapse,
    Box,
    Table,
    TableHead,
    TableBody,
} = await import("@mui/material");
// utils
import { fDate } from "@/utils/formatTime";
// components
import ConfirmDialog from "@/Components/confirm-dialog";
import Iconify from "@/Components/iconify";
import MenuPopover from "@/Components/menu-popover";
import { isFuture, isSameDay } from "date-fns";
import Label from "@/Components/label";

// ----------------------------------------------------------------------

PreplanningRegisterTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onEdit: PropTypes.func,
};

const TODAY = new Date();

export function PreplanningRegisterTableRow({
    row,
    selected,
    onSelectRow,
    onDeleteRow,
    onEdit,
}) {
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

    const DateStatus = isSameDay(TODAY, new Date(row.date_issued)) ? (
        <Label color="success">Today</Label>
    ) : isFuture(new Date(row.date_issued)) ? (
        <Label color="success">Tomorrow</Label>
    ) : (
        <Label>{fDate(row.date_issued)}</Label>
    );

    return (
        <>
            <TableRow hover selected={selected} sx={{ width: 1 }}>
                <TableCell onClick={handleTriggerCollapse} padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                            alt={row.fullname}
                            src={
                                row?.profile?.thumbnail ||
                                route("image", {
                                    path: "assets/images/default-profile.jpg",
                                    w: 128,
                                    h: 128,
                                    fit: "crop",
                                })
                            }
                        />

                        <Typography variant="subtitle2" noWrap>
                            {row.fullname}
                        </Typography>
                    </Stack>
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    align="left"
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {row.position}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    align="left"
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {fDate(row.created_at)}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    align="left"
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {row.employees?.length ?? 0}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    align="left"
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {DateStatus}
                </TableCell>

                <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end">
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
                            color={openPopover ? "inherit" : "default"}
                            onClick={handleOpenPopover}
                        >
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Stack>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                >
                    <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small">
                                <caption>Assigned Employees</caption>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Position</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(row.employees ?? []).map(
                                        (subrow, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{idx + 1}</TableCell>
                                                <TableCell>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={2}
                                                    >
                                                        <Avatar
                                                            alt={
                                                                subrow.fullname
                                                            }
                                                            src={
                                                                subrow?.profile
                                                                    ?.thumbnail ||
                                                                route("image", {
                                                                    path: "assets/images/default-profile.jpg",
                                                                    w: 128,
                                                                    h: 128,
                                                                    fit: "crop",
                                                                })
                                                            }
                                                        />

                                                        <Typography
                                                            variant="subtitle2"
                                                            noWrap
                                                        >
                                                            {subrow.fullname}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    {subrow.position}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
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
                        handleClosePopover();
                        onEdit(row);
                    }}
                >
                    <Iconify icon="eva:edit-fill" />
                    Edit
                </MenuItem>

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
                        onClick={() => {
                            handleCloseConfirm();
                            onDeleteRow();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}
