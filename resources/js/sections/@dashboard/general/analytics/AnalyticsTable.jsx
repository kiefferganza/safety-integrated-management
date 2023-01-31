import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CountUp from 'react-countup';

const AnalyticsTable = ({ headTitles = [], data = [], color = 'primary', ...other }) => {
	return (
		<Card
			sx={{
				color: (theme) => theme.palette[color].darker,
				bgcolor: (theme) => theme.palette[color].lighter,
				height: "100%",
				...other
			}}
		>
			<TableContainer>
				<Table size="small">
					<TableHead>
						<TableRow>
							{headTitles.map((head, idx) => (
								<TableCell sx={{ color: (theme) => theme.palette[color].darker }} key={idx} align={head?.align || "left"}>{head.title}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((d, idx) => (
							<TableRow key={idx} hover sx={{ width: 1 }}>
								<TableCell sx={{ color: (theme) => theme.palette[color].darker }} component="th" scope="row">{d?.title}</TableCell>
								<TableCell sx={{ color: (theme) => theme.palette[color].darker }} width={80} align="right">
									<CountUp start={0} end={d?.month || 0} duration={1} separator="," />
								</TableCell>
								<TableCell sx={{ color: (theme) => theme.palette[color].darker }} width={80} align="right">
									<CountUp start={0} end={d?.itd || 0} duration={1} separator="," />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Card>
	)
}

export default AnalyticsTable