import { Card, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const AnalyticsTable = ({ isLoading, headTitles = [], data = [], color = 'primary', sx = {}, ...other }) => {

	return (
		<Card
			sx={{
				color: (theme) => theme.palette[color].darker,
				bgcolor: (theme) => theme.palette[color].lighter,
				height: "100%",
				pb: 1,
				...sx,
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
						{isLoading ? (
							<>
								{Array.from(Array(8)).map((_, idx) => (
									<TableRow key={idx}>
										<TableCell colSpan={3}>
											<Skeleton variant="rounded" width="100%" height={24} />
										</TableCell>
									</TableRow>
								))}
							</>
						) : (
							data.map((d, idx) => (
								<TableRow key={idx} hover sx={{ width: 1 }}>
									<TableCell sx={{ color: (theme) => theme.palette[color].darker, borderBottom: 1 }} component="th" scope="row">{d?.title}</TableCell>
									<TableCell sx={{ color: (theme) => theme.palette[color].darker, borderBottom: 1 }} width={80} align="right">
										{d.month.toLocaleString()}
									</TableCell>
									<TableCell sx={{ color: (theme) => theme.palette[color].darker, borderBottom: 1 }} width={80} align="right">
										{d.itd.toLocaleString()}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Card>
	)
}

export default AnalyticsTable