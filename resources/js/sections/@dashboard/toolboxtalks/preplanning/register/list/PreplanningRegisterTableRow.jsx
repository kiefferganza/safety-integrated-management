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
    Link,
} = await import("@mui/material");
// utils
import { fDate } from "@/utils/formatTime";
// components
import ConfirmDialog from "@/Components/confirm-dialog";
import Iconify from "@/Components/iconify";
import MenuPopover from "@/Components/menu-popover";
import { isPast } from "date-fns";
import Label from "@/Components/label";
import { Link as InertiaLink } from "@inertiajs/inertia-react";

// ----------------------------------------------------------------------

PreplanningRegisterTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onEdit: PropTypes.func,
};

const TYPES = {
    1: "Civil",
    2: "Electrical",
    3: "Mechanical",
    4: "Workshop",
    5: "Office",
};

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

    const isExpired = isPast(new Date(row.date_issued).setHours(11, 59, 59));

    return (
        <>
            <TableRow hover selected={selected} sx={{ width: 1 }}>
                <TableCell onClick={handleTriggerCollapse} padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    align="left"
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {row.form_number}
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
                    {fDate(row.date_issued)}
                </TableCell>

                <TableCell
                    onClick={handleTriggerCollapse}
                    align="left"
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {isExpired ? (
                        <Label color="error">Expired</Label>
                    ) : row?.status ? (
                        <Label color="success">Completed</Label>
                    ) : (
                        <Label color="warning">Pending</Label>
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
                                            <TableCell>Location</TableCell>
                                            <TableCell>
                                                Exact Location
                                            </TableCell>
                                            <TableCell>TBT Type</TableCell>
                                            <TableCell>Submitted</TableCell>
                                            <TableCell></TableCell>
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
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                }}
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
                                                        {subrow.location}
                                                    </TableCell>

                                                    <TableCell>
                                                        {subrow.exact_location}
                                                    </TableCell>

                                                    <TableCell>
                                                        {TYPES?.[
                                                            subrow.tbt_type
                                                        ] ?? ""}
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        {subrow.status ? (
                                                            <Label color="success">
                                                                Yes
                                                            </Label>
                                                        ) : (
                                                            <Label color="error">
                                                                No
                                                            </Label>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {subrow?.submittedTbt
                                                            ?.tbt_id ? (
                                                            <Link
                                                                component={
                                                                    InertiaLink
                                                                }
                                                                href={route(
                                                                    "toolboxtalk.management.show",
                                                                    subrow
                                                                        .submittedTbt
                                                                        .tbt_id
                                                                )}
                                                                variant="subtitle2"
                                                                size="small"
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                }}
                                                            >
                                                                View
                                                            </Link>
                                                        ) : (
                                                            <Button
                                                                disabled
                                                                variant="text"
                                                                size="small"
                                                                fullWidth
                                                            >
                                                                View
                                                            </Button>
                                                        )}
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
