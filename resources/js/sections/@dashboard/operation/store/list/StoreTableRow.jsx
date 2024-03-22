import PropTypes from "prop-types";
import { useState } from "react";
import { sentenceCase } from "change-case";
const { currencies } = await import("@/_mock/arrays/_currencies");
import { PATH_DASHBOARD } from "@/routes/paths";
import { Link, usePage } from "@inertiajs/inertia-react";
// @mui
const {
    Stack,
    Button,
    TableRow,
    Checkbox,
    MenuItem,
    TableCell,
    IconButton,
    Divider,
} = await import("@mui/material");
import { Link as MuiLink } from "@mui/material";
// utils
import { fDate } from "@/utils/formatTime";
import { fCurrencyNumber } from "@/utils/formatNumber";
// components
import Label from "@/Components/label";
import Iconify from "@/Components/iconify";
import MenuPopover from "@/Components/menu-popover";
import ConfirmDialog from "@/Components/confirm-dialog";
const { Image } = await import("@/Components/image/Image");
const { AddRemoveStockDialog } = await import("../portal/AddRemoveStockDialog");

// ----------------------------------------------------------------------

StoreTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onViewRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
};

export default function StoreTableRow({
    row,
    selected,
    onSelectRow,
    onDeleteRow,
}) {
    const {
        auth: { user },
    } = usePage().props;
    const {
        user_id,
        name,
        thumbnail,
        created_at,
        updated_at,
        status,
        price,
        currency,
        qty,
        min_qty,
        unit,
        slug,
    } = row;

    const [openStock, setOpenStock] = useState(false);

    const [stockType, setStockType] = useState("");

    const [openConfirm, setOpenConfirm] = useState(false);

    const [openPopover, setOpenPopover] = useState(null);

    const handleAddStock = () => {
        handleClosePopover();
        setStockType("add");
        setOpenStock(true);
    };

    const handleRemoveStock = () => {
        handleClosePopover();
        setStockType("remove");
        setOpenStock(true);
    };

    const handleCloseStock = () => {
        setStockType("");
        setOpenStock(false);
    };

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

    let currencySymbol = "IQD";
    if (currency in currencies) {
        currencySymbol =
            currencies[currency]?.symbol_native ||
            currencies[currency]?.symbol ||
            "IQD";
    }

    const canEdit = user.id === user_id;
    const canDelete = user.id === user_id;
    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Image
                            disabledEffect
                            visibleByDefault
                            alt={name}
                            src={thumbnail}
                            sx={{ borderRadius: 1.5, width: 48, height: 48 }}
                        />

                        <MuiLink
                            component={Link}
                            href={PATH_DASHBOARD.store.show(slug)}
                            noWrap
                            color="inherit"
                            variant="subtitle2"
                            sx={{
                                cursor: "pointer",
                                textTransform: "capitalize",
                            }}
                        >
                            {name}
                        </MuiLink>
                    </Stack>
                </TableCell>

                <TableCell align="left">
                    {qty}/{min_qty}
                </TableCell>

                <TableCell align="left">{unit}</TableCell>

                <TableCell align="left">
                    {currencySymbol} {fCurrencyNumber(price)}
                </TableCell>

                <TableCell>{fDate(created_at)}</TableCell>

                <TableCell>{fDate(updated_at)}</TableCell>

                <TableCell align="left">
                    <Label
                        variant="soft"
                        color={
                            (status === "out_of_stock" && "error") ||
                            (status === "low_stock" && "warning") ||
                            (status === "need_reorder" && "info") ||
                            "success"
                        }
                        sx={{ textTransform: "capitalize" }}
                    >
                        {status ? sentenceCase(status) : ""}
                    </Label>
                </TableCell>

                <TableCell align="right">
                    <IconButton
                        color={openPopover ? "primary" : "default"}
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
                sx={{ width: 140 }}
            >
                {
                    <>
                        <MenuItem
                            onClick={handleAddStock}
                            sx={{ color: "success.main" }}
                        >
                            <Iconify icon="eva:plus-fill" />
                            Add
                        </MenuItem>
                        <MenuItem
                            onClick={handleRemoveStock}
                            sx={{ color: "warning.main" }}
                        >
                            <Iconify icon="eva:minus-fill" />
                            Remove
                        </MenuItem>
                        <Divider />
                    </>
                }
                {
                    <MenuItem
                        href={PATH_DASHBOARD.store.show(slug)}
                        component={Link}
                        onClick={handleClosePopover}
                    >
                        <Iconify icon="eva:eye-fill" />
                        View
                    </MenuItem>
                }
                {canEdit && (
                    <MenuItem
                        href={PATH_DASHBOARD.store.edit(slug)}
                        component={Link}
                        onClick={handleClosePopover}
                    >
                        <Iconify icon="eva:edit-fill" />
                        Edit
                    </MenuItem>
                )}
                {canDelete && (
                    <>
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
            <AddRemoveStockDialog
                open={openStock}
                onClose={handleCloseStock}
                type={stockType}
                store={row}
            />
        </>
    );
}
