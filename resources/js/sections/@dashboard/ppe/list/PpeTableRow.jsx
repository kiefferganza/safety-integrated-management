import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
import { currencies } from '@/_mock/arrays/_currencies';
// @mui
import { Stack, Button, TableRow, Checkbox, MenuItem, TableCell, IconButton, Link as MuiLink } from '@mui/material';
// utils
import { fDate } from '@/utils/formatTime';
import { fCurrencyNumber } from '@/utils/formatNumber';
// components
import Label from '@/Components/label';
import Image from '@/Components/image';
import Iconify from '@/Components/iconify';
import MenuPopover from '@/Components/menu-popover';
import ConfirmDialog from '@/Components/confirm-dialog';
import { Link } from '@inertiajs/inertia-react';
import { PATH_DASHBOARD } from '@/routes/paths';

// ----------------------------------------------------------------------

PpeTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onEditRow: PropTypes.func,
	onViewRow: PropTypes.func,
	onSelectRow: PropTypes.func,
	onDeleteRow: PropTypes.func,
};

export default function PpeTableRow ({ row, selected, onSelectRow, onDeleteRow, onEditRow }) {
	const { item, img_src, date_created, date_updated, status, item_price, item_currency, current_stock_qty, min_qty, try: unit, slug, inventory_id } = row;

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

	let currencySymbol = "IQD";
	if (item_currency in currencies) {
		currencySymbol = currencies[item_currency]?.symbol_native || currencies[item_currency]?.symbol || "IQD";
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
							src={`/storage/media/photos/inventory/${img_src}`}
							sx={{ borderRadius: 1.5, width: 48, height: 48 }}
						/>

						<MuiLink component={Link} href={PATH_DASHBOARD.ppe.view(slug)} noWrap color="inherit" variant="subtitle2" sx={{ cursor: 'pointer', textTransform: 'capitalize' }}>
							{item}
						</MuiLink>
					</Stack>
				</TableCell>

				<TableCell align="left">{current_stock_qty}/{min_qty}</TableCell>

				<TableCell align="left">{unit}</TableCell>

				<TableCell align="right">{currencySymbol} {fCurrencyNumber(item_price)}</TableCell>

				<TableCell>{fDate(date_created)}</TableCell>

				<TableCell>{fDate(date_updated)}</TableCell>

				<TableCell align="center">
					<Label
						variant="soft"
						color={
							(status === 'out_of_stock' && 'error') || (status === 'low_stock' && 'warning') || 'success'
						}
						sx={{ textTransform: 'capitalize' }}
					>
						{status ? sentenceCase(status) : ''}
					</Label>
				</TableCell>

				<TableCell align="right">
					<IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon="eva:more-vertical-fill" />
					</IconButton>
				</TableCell>
			</TableRow>

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 140 }}>
				<MenuItem
					onClick={() => {
						handleOpenConfirm();
						handleClosePopover();
					}}
					sx={{ color: 'error.main' }}
				>
					<Iconify icon="eva:trash-2-outline" />
					Delete
				</MenuItem>

				<MenuItem
					onClick={() => {
						onEditRow();
						handleClosePopover();
					}}
				>
					<Iconify icon="eva:edit-fill" />
					Edit
				</MenuItem>
			</MenuPopover>

			<ConfirmDialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				title="Delete"
				content="Are you sure want to delete?"
				action={
					<Button variant="contained" color="error" onClick={onDeleteRow}>
						Delete
					</Button>
				}
			/>
		</>
	);
}
