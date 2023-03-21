import { useDateRangePicker } from "@/Components/date-range-picker";
import { fDate } from '@/utils/formatTime';
import { endOfMonth, startOfMonth } from "date-fns";
// MUI
const { Box, Stack, Typography, Grid, Card, Divider } = await import('@mui/material');
// Component
const { Image } = await import('@/Components/image/Image');


const ReportDetailHead = ({ inventoryReport, title = "" }) => {
	const { shortLabel } = useDateRangePicker(
		new Date(inventoryReport.inventory_start_date),
		new Date(inventoryReport.inventory_end_date)
	);

	const forcastDate = new Date(inventoryReport.budget_forcast_date);
	const forcastMonth = `${fDate(startOfMonth(forcastDate), 'dd')} - ${fDate(endOfMonth(forcastDate), 'dd MMM yyyy')}`;
	return (
		<Box>
			<Box sx={{ mb: 2 }}>
				<Box sx={{ mb: { xs: 0, md: -1 } }}>
					<Image disabledEffect alt="logo" src="/logo/Fiafi-logo.png" sx={{ maxWidth: 160, margin: { xs: '0px auto 8px auto', md: 0 } }} />
				</Box>
				<Box>
					<Typography variant="h4" textAlign="center">{title}</Typography>
				</Box>
			</Box>

			<Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 3, md: 0 }} justifyContent="space-between" sx={{ mb: 5 }}>
				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700}>CMS Number:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{inventoryReport.form_number}</Typography>
					</Box>
				</Stack>

				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700} textAlign="center">Revision:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" textAlign="center">{inventoryReport?.revision_no}</Typography>
					</Box>
				</Stack>

				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700}>Rollout Date:</Typography>
					</Box>
					<Box>
						<Typography>{fDate(inventoryReport.created_at)}</Typography>
					</Box>
				</Stack>
			</Stack>
			<Grid container spacing={{ xs: 2, md: 5 }} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6}>
					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Contract No.</Typography>
						</Box>
						<Box minHeight={24}>
							<Typography variant="body1" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>{inventoryReport.contract_no}</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Inventory Date</Typography>
						</Box>
						<Box minHeight={24}>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{shortLabel}</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Conducted By</Typography>
						</Box>
						<Box minHeight={24}>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{inventoryReport.conducted_by}</Typography>
						</Box>
					</Box>

				</Grid>
				<Grid item xs={12} sm={6}>
					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Budget Forecast Date</Typography>
						</Box>
						<Box minHeight={24}>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{forcastMonth}</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Location</Typography>
						</Box>
						<Box minHeight={24}>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{inventoryReport.location}</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Submitted Date</Typography>
						</Box>
						<Box minHeight={24}>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{fDate(inventoryReport.submitted_date)}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	)
}

export default ReportDetailHead