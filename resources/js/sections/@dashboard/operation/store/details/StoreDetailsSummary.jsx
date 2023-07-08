import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
const { Stack, Divider, Typography, Button } = await import('@mui/material');
// utils
import { fCurrencyNumberAndSymbol } from '@/utils/formatNumber';
import { fDate } from '@/utils/formatTime';
// components
import Label from '@/Components/label';
import Iconify from '@/Components/iconify';
const { AddRemoveStockDialog } = await import('../portal/AddRemoveStockDialog');

// ----------------------------------------------------------------------

StoreDetailsSummary.propTypes = {
	store: PropTypes.object,
};

export default function StoreDetailsSummary ({ store, ...other }) {
	const { name, created_at, updated_at, status, price, currency, qty, min_qty, unit } = store;
	const [openStock, setOpenStock] = useState(false);
	const [stockType, setStockType] = useState("");

	const handleAddStock = () => {
		setStockType("add");
		setOpenStock(true);
	}

	const handleRemoveStock = () => {
		setStockType("remove");
		setOpenStock(true);
	}

	const handleCloseStock = () => {
		setStockType("");
		setOpenStock(false);
	}

	return (
		<>
			<Stack
				spacing={3}
				sx={{
					p: (theme) => ({
						md: theme.spacing(5, 5, 0, 2),
					}),
				}}
				{...other}
			>
				<Stack spacing={2}>
					<Label
						variant="soft"
						color={
							(status === 'out_of_stock' && 'error') || (status === 'low_stock' && 'warning') || (status === 'need_reorder' && 'info') || 'success'
						}
						sx={{ textTransform: 'uppercase', mr: 'auto' }}
					>
						{sentenceCase(status || '')}
					</Label>

					<Typography variant="h5">{name}</Typography>

					<Stack direction="row" alignItems="center" spacing={1}>
						<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						</Typography>
					</Stack>

					<Typography variant="h4">
						{fCurrencyNumberAndSymbol(price, currency)}
					</Typography>
				</Stack>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Typography variant="subtitle2">Unit</Typography>

					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						{unit}
					</Typography>
				</Stack>

				<Stack direction="row" justifyContent="space-between">
					<Typography variant="subtitle2" sx={{ height: 40, lineHeight: '40px', flexGrow: 1 }}>
						Created
					</Typography>

					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						{fDate(created_at)}
					</Typography>
				</Stack>

				<Stack direction="row" justifyContent="space-between">
					<Typography variant="subtitle2" sx={{ height: 40, lineHeight: '40px', flexGrow: 1 }}>
						Last Update
					</Typography>

					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						{fDate(updated_at)}
					</Typography>
				</Stack>

				<Stack direction="row" justifyContent="space-between">
					<Typography
						variant="subtitle2"
						sx={{
							height: 36,
							lineHeight: '36px',
						}}
					>
						Quantity
					</Typography>

					<Stack spacing={1}>
						<Typography variant="body2" sx={{ color: 'text.secondary' }}>
							Available: {qty?.toLocaleString()}
						</Typography>
						<Typography variant="caption" component="div" sx={{ textAlign: 'right', color: 'text.secondary' }}>
							Minium {min_qty?.toLocaleString()}
						</Typography>
					</Stack>
				</Stack>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<Stack direction="row" spacing={2}>
					<Button
						fullWidth
						size="large"
						color="success"
						variant="contained"
						startIcon={<Iconify icon="eva:plus-fill" />}
						sx={{ whiteSpace: 'nowrap' }}
						onClick={handleAddStock}
					>
						Add Stock
					</Button>

					<Button
						fullWidth
						size="large"
						color="warning"
						variant="contained"
						startIcon={<Iconify icon="eva:minus-fill" />}
						onClick={handleRemoveStock}
					>
						Pull out Stock
					</Button>
				</Stack>
			</Stack>
			<AddRemoveStockDialog
				open={openStock}
				onClose={handleCloseStock}
				store={store}
				type={stockType}
			/>
		</>
	);
}
