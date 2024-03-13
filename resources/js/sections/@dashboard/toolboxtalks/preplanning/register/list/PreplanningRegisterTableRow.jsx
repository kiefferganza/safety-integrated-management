import PropTypes from "prop-types";
import { useCallback, useState } from "react";
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
    TableContainer,
    Paper,
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

    const handleTriggerCollapse = useCallback(() => {
        setOpenCollapse((currState) => !currState);
    });

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

                <TableCell onClick={handleTriggerCollapse}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={row.fullname} src={row.img} />

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
                    {row.location}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    align="left"
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {DateStatus}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    align="left"
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {row?.status ? (
                        <Label color="success">Submitted</Label>
                    ) : (
                        <Label color="warning">Not Submitted</Label>
                    )}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    align="left"
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {row.assigned?.length ?? 0}
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
                    colSpan={8}
                >
                    <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <caption>
                                        Assigned Employees for{" "}
                                        <Typography
                                            component="span"
                                            variant="subtitle2"
                                            fontStyle="italic"
                                        >
                                            -{fDate(row.date_issued)}-
                                        </Typography>
                                    </caption>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Position</TableCell>
                                            <TableCell>Submitted TBT</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(row.assigned ?? []).map(
                                            (subrow, idx) => (
                                                <TableRow
                                                    sx={{
                                                        "& td, & th": {
                                                            borderBottom: 1,
                                                        },
                                                    }}
                                                    key={idx}
                                                >
                                                    <TableCell>
                                                        {idx + 1}
                                                    </TableCell>
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
                                                                src={subrow.img}
                                                            />

                                                            <Typography
                                                                variant="subtitle2"
                                                                noWrap
                                                            >
                                                                {
                                                                    subrow.fullname
                                                                }
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        {subrow.position}
                                                    </TableCell>

                                                    <TableCell>
                                                        {subrow.submittedTbt}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
