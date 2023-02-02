import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const AnalyticsTable = ({ headTitles = [], data = [], color = 'primary', ...other }) => {
	return (
		<Card
			sx={{
				color: (theme) => theme.palette[color].darker,
				bgcolor: (theme) => theme.palette[color].lighter,
				height: "100%",
				pb: 1,
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
								<TableCell sx={{ color: (theme) => theme.palette[color].darker, borderBottom: 1 }} component="th" scope="row">{d?.title}</TableCell>
								<TableCell sx={{ color: (theme) => theme.palette[color].darker, borderBottom: 1 }} width={80} align="right">
									{d?.month?.toLocaleString() || 0}
								</TableCell>
								<TableCell sx={{ color: (theme) => theme.palette[color].darker, borderBottom: 1 }} width={80} align="right">
									{d?.itd?.toLocaleString() || 0}
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