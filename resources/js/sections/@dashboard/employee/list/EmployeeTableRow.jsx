import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "@inertiajs/inertia-react";
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
    Typography,
    Avatar,
} from "@mui/material";
// utils
import { fDate } from "@/utils/formatTime";
// components
import Label from "@/Components/label";
import Iconify from "@/Components/iconify";
import MenuPopover from "@/Components/menu-popover";
import ConfirmDialog from "@/Components/confirm-dialog";
import { Inertia } from "@inertiajs/inertia";
import { useSwal } from "@/hooks/useSwal";
// import usePermission from '@/hooks/usePermission';
// import { useSelector, useDispatch } from 'react-redux';
// import { followUser } from '@/redux/slices/employee';

// ----------------------------------------------------------------------

EmployeeTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    canDelete: PropTypes.bool,
};

export default function EmployeeTableRow({
    row,
    selected,
    onSelectRow,
    onDeleteRow,
    canDelete,
    canEditAll,
}) {
    const { load, stop } = useSwal();
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

    const handleActivate = () => {
        handleClosePopover();
        Inertia.post(
            route("management.employee.activate"),
            { ids: [row.employee_id] },
            {
                preserveScroll: true,
                onStart() {
                    load("Activating employee's", "please wait...");
                },
                onFinish() {
                    stop();
                },
            }
        );
    };

    const handleDeactivate = () => {
        handleClosePopover();
        Inertia.post(
            route("management.employee.deactivate"),
            { ids: [row.employee_id] },
            {
                preserveScroll: true,
                onStart() {
                    load("Deactivating employee's", "please wait...");
                },
                onFinish() {
                    stop();
                },
            }
        );
    };

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
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

                <TableCell align="left">{fDate(row.date_created)}</TableCell>

                <TableCell align="left">{row.position}</TableCell>

                <TableCell align="left">{row.department}</TableCell>

                <TableCell align="left">{row.company_name ?? "N/A"}</TableCell>

                <TableCell align="left">{row.country || "N/A"}</TableCell>

                <TableCell align="left">{row.phone_no}</TableCell>

                <TableCell align="left">
                    <Label
                        variant="soft"
                        color={
                            (row.status === "active" && "success") ||
                            (row.status === "inactive" && "warning") ||
                            "default"
                        }
                    >
                        {row.status}
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
                    component={Link}
                    href={route("management.employee.show", row.id)}
                >
                    <Iconify icon="eva:eye-fill" />
                    View
                </MenuItem>
                {/* {row.user_id != user.user_id && (
					<MenuItem
						onClick={handleFollowEmployee}
						disabled={(row.user_id == 0) || loading}
					>
						<Iconify icon="eva:heart-fill" />
						<Iconify icon="eva:checkmark-fill" />
						Follow
					</MenuItem>
				)} */}
                {canEditAll && (
                    <>
                        <MenuItem
                            component={Link}
                            href={route("management.employee.edit", row.id)}
                            preserveScroll
                            onClick={handleClosePopover}
                        >
                            <Iconify icon="eva:edit-fill" />
                            Edit
                        </MenuItem>
                        <Divider sx={{ borderStyle: "dashed" }} />
                        {row.is_active === 1 && (
                            <MenuItem
                                onClick={handleActivate}
                                sx={{ color: "success.main" }}
                            >
                                <Iconify icon="mdi:user-key" />
                                Activate
                            </MenuItem>
                        )}
                        {row.is_active === 0 && (
                            <MenuItem
                                onClick={handleDeactivate}
                                sx={{ color: "warning.main" }}
                            >
                                <Iconify icon="mdi:account-off" />
                                Deactivate
                            </MenuItem>
                        )}
                    </>
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
