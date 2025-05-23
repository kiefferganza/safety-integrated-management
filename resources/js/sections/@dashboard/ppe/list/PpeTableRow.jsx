import PropTypes from "prop-types";
import { useState } from "react";
import { sentenceCase } from "change-case";
const { currencies } = await import("@/_mock/arrays/_currencies");
import { PATH_DASHBOARD } from "@/routes/paths";
import { Link } from "@inertiajs/inertia-react";
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

PpeTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onViewRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
};

export default function PpeTableRow({
    row,
    selected,
    onSelectRow,
    onDeleteRow,
    canAddRemoveStock,
    canView,
    canEdit,
    canDelete,
}) {
    const {
        item,
        img_src,
        date_created,
        date_updated,
        status,
        item_price,
        item_currency,
        current_stock_qty,
        min_qty,
        try: unit,
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
    if (item_currency in currencies) {
        currencySymbol =
            currencies[item_currency]?.symbol_native ||
            currencies[item_currency]?.symbol ||
            "IQD";
    }
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
                            alt={item}
                            src={
                                img_src
                                    ? `/storage/media/photos/inventory/${img_src}`
                                    : "/storage/assets/placeholder.svg"
                            }
                            sx={{ borderRadius: 1.5, width: 48, height: 48 }}
                        />

                        <MuiLink
                            component={Link}
                            href={PATH_DASHBOARD.ppe.view(slug)}
                            noWrap
                            color="inherit"
                            variant="subtitle2"
                            sx={{
                                cursor: "pointer",
                                textTransform: "capitalize",
                            }}
                        >
                            {item}
                        </MuiLink>
                    </Stack>
                </TableCell>

                <TableCell align="left">
                    {current_stock_qty}/{min_qty}
                </TableCell>

                <TableCell align="left">{unit}</TableCell>

                <TableCell align="right">
                    {currencySymbol} {fCurrencyNumber(item_price)}
                </TableCell>

                <TableCell>{fDate(date_created)}</TableCell>

                <TableCell>{fDate(date_updated)}</TableCell>

                <TableCell align="center">
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
                {canAddRemoveStock && (
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
                )}
                {canView && (
                    <MenuItem
                        href={PATH_DASHBOARD.ppe.view(slug)}
                        component={Link}
                        onClick={handleClosePopover}
                    >
                        <Iconify icon="eva:eye-fill" />
                        View
                    </MenuItem>
                )}
                {canEdit && (
                    <MenuItem
                        href={PATH_DASHBOARD.ppe.edit(slug)}
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
                inventory={row}
            />
        </>
    );
}
