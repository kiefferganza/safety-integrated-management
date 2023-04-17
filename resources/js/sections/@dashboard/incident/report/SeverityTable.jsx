// mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { StyledGrid, StyledTableCell, StyledTableHead } from './incedentStyle';
// components
import Scrollbar from '@/Components/scrollbar/Scrollbar';


const SeverityTable = ({ severity, total }) => {
	return (
		<Card elevation={2} sx={{ p: 2 }}>
			<CardHeader title='Potential Severity' />
			<Scrollbar>
				<StyledGrid gridTemplateColumns={`repeat(5, 2fr)`} gridTemplateRows="auto 1fr">
					<StyledTableHead>
						<Typography variant="subtitle2" textAlign="center">Minor</Typography>
					</StyledTableHead>
					<StyledTableHead>
						<Typography variant="subtitle2" textAlign="center">Significant</Typography>
					</StyledTableHead>
					<StyledTableHead>
						<Typography variant="subtitle2" textAlign="center">Major</Typography>
					</StyledTableHead>
					<StyledTableHead>
						<Typography variant="subtitle2" textAlign="center">Fatality</Typography>
					</StyledTableHead>
					<StyledTableHead sx={{ borderRightWidth: 1 }}>
						<Typography variant="subtitle2" textAlign="center">TOTAL</Typography>
					</StyledTableHead>

					<StyledTableCell>
						<Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>{severity?.Minor || 0}</Typography>
					</StyledTableCell>
					<StyledTableCell>
						<Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>{severity?.Significant || 0}</Typography>
					</StyledTableCell>
					<StyledTableCell>
						<Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>{severity?.Major || 0}</Typography>
					</StyledTableCell>
					<StyledTableCell>
						<Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>{severity?.Fatality || 0}</Typography>
					</StyledTableCell>
					<StyledTableCell sx={{ borderRightWidth: 1 }}>
						<Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>{total || 0}</Typography>
					</StyledTableCell>
				</StyledGrid>
			</Scrollbar>
		</Card>
	)
}

export default SeverityTable