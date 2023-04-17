// mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { StyledGrid, StyledTableCell, StyledTableHead } from './incedentStyle';
// components
import Scrollbar from '@/Components/scrollbar/Scrollbar';

// -----------------------------------------------------

const IndicatorTable = ({ indicator }) => {

	const indicatorLabels = Object.keys(indicator || {});
	const indicatorValues = Object.values(indicator || {});

	return (
		<Card elevation={2} sx={{ p: 2, height: 1 }}>
			<CardHeader title='Leading Indicators' />
			<Scrollbar>
				<StyledGrid gridTemplateColumns={`repeat(${indicatorLabels.length}, 1fr)`}>
					{indicatorLabels.map((label, idx) => (
						<StyledTableHead key={idx}>
							<Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>{label}</Typography>
						</StyledTableHead>
					))}
					{indicatorValues.map((value, idx) => (
						<StyledTableCell key={idx}>
							<Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>{value?.total || 0}</Typography>
						</StyledTableCell>
					))}
				</StyledGrid>
			</Scrollbar>
		</Card>
	)
}

export default IndicatorTable