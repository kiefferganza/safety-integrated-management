// mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { StyledGrid, StyledTableCell, StyledTableHead } from './incedentStyle';
// components
import Scrollbar from '@/Components/scrollbar/Scrollbar';

// -----------------------------------------------------

const RootCauseTable = ({ rootCause }) => {

	const rootCauseLabels = Object.keys(rootCause || {});
	const rootCauseValues = Object.values(rootCause || {});
	return (
		<Card elevation={2} sx={{ p: 2, height: 1 }}>
			<CardHeader title='Root Causes Analysis' />
			<Scrollbar>
				<StyledGrid gridTemplateColumns={`repeat(${rootCauseValues.length}, 2fr)`} gridTemplateRows="auto 1fr">
					{rootCauseLabels.map((label, idx) => (
						<StyledTableHead key={idx}>
							<Typography variant="subtitle2" textAlign="center">{label}</Typography>
						</StyledTableHead>
					))}
					{rootCauseValues.map((value, idx) => (
						<StyledTableCell key={idx}>
							<Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>{value || 0}</Typography>
						</StyledTableCell>
					))}
				</StyledGrid>
			</Scrollbar>
		</Card>
	)
}

export default RootCauseTable