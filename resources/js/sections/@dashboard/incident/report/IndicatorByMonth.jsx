import { Fragment } from 'react';
// mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { StyledGrid, StyledTableCell, StyledTableHead } from './incedentStyle';
import Scrollbar from '@/Components/scrollbar/Scrollbar';

const MONTHS = ["MONTH", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "TOTAL",];

// -----------------------------------------------------

const IndicatorByMonth = ({ indicator, indicatorTotal }) => {

	const verticalTotal = Object.values(indicator || {}).reduce((acc, curr) => {
		acc[1] += curr.months[1].value;
		acc[2] += curr.months[2].value;
		acc[3] += curr.months[3].value;
		acc[4] += curr.months[4].value;
		acc[5] += curr.months[5].value;
		acc[6] += curr.months[6].value;
		acc[7] += curr.months[7].value;
		acc[8] += curr.months[8].value;
		acc[9] += curr.months[9].value;
		acc[10] += curr.months[10].value;
		acc[11] += curr.months[11].value;
		acc[12] += curr.months[12].value;
		return acc;
	}, {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
		10: 0,
		11: 0,
		12: 0,
	});

	const indecatorLabels = Object.keys(indicator || {});

	return (
		<Card elevation={2} sx={{ p: 2 }}>
			<CardHeader title='Indicator / Months' />
			<Scrollbar>
				<StyledGrid gridTemplateColumns="repeat(14, 1fr)">
					{MONTHS.map((row, idx) => (
						<StyledTableHead key={idx}>
							<Typography variant="subtitle2">{row}</Typography>
						</StyledTableHead>
					))}
					{indecatorLabels.map((label, idx) => {
						const months = Object.values(indicator[label]?.months || {});
						const horizontalTotal = indicator[label]?.total || 0;
						return (
							<Fragment key={idx}>
								<StyledTableCell>
									<Typography variant="subtitle2">{label}</Typography>
								</StyledTableCell>
								{months.map((month, index) => (
									<StyledTableCell key={index} sx={{ backgroundColor: (theme) => month?.value !== 0 ? theme.palette.info.main : "inherit" }}>
										<Typography variant="subtitle2">{(month?.value || 0)}</Typography>
									</StyledTableCell>
								))}
								<StyledTableCell sx={{ borderRightWidth: 1 }}>
									<Typography variant="subtitle2">{horizontalTotal}</Typography>
								</StyledTableCell>
							</Fragment>
						)
					})}
					<StyledTableCell>
						<Typography variant="subtitle2">TOTAL</Typography>
					</StyledTableCell>
					{Object.values(verticalTotal).map((total, idx) => (
						<StyledTableCell key={idx}>
							<Typography variant="subtitle2">{total}</Typography>
						</StyledTableCell>
					))}
					<StyledTableCell sx={{ borderRightWidth: 1 }}>
						<Typography variant="subtitle2">{indicatorTotal}</Typography>
					</StyledTableCell>
				</StyledGrid>
			</Scrollbar>
		</Card>
	)
}

export default IndicatorByMonth