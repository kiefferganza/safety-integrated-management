import { Box, Stack, Typography } from '@mui/material';
import EmptyContent from '@/Components/empty-content';
import Scrollbar from '@/Components/scrollbar';
import { StyledGridBox, StyledTableCell, StyledTableHead } from './tbtReportStyle';

const TBTReportTable = ({ positionData, days, tbtTotal }) => {
	return (
		Object.entries(positionData).length === 0 ? (
			<EmptyContent
				title="No Data"
				sx={{
					'& span.MuiBox-root': { height: 160 },
				}}
			/>
		) : (
			<Scrollbar sx={{ py: 1 }}>
				<Stack width={1} minWidth={(theme) => theme.breakpoints.values.lg} borderLeft={1}>
					<StyledGridBox gridTemplateColumns={`repeat(${Object.keys(days).length + 11}, minmax(40px, 1fr))`}>
						<StyledTableHead>#</StyledTableHead>
						<StyledTableHead sx={{ gridColumn: "span 4" }}>
							<Typography variant="subtitle2">Position</Typography>
						</StyledTableHead>
						{Object.keys(days).map((d) => (
							<StyledTableHead key={d}>
								<Typography variant="subtitle2">{d}</Typography>
							</StyledTableHead>
						))}
						<StyledTableHead sx={{ gridColumn: "span 2" }}>
							<Typography variant="subtitle2" textAlign="center">TOTAL <span style={{ display: "block" }}>(MP)</span></Typography>
						</StyledTableHead>
						<StyledTableHead sx={{ gridColumn: "span 2" }}>
							<Typography variant="subtitle2" textAlign="center">TOTAL <span style={{ display: "block" }}>(MH)</span></Typography>
						</StyledTableHead>
					</StyledGridBox>
				</Stack>
				{Object.entries(positionData).map((pos, index) => {
					return (
						<Stack width={1} key={pos[0]} minWidth={(theme) => theme.breakpoints.values.lg} borderLeft={1}>
							<Box display="grid" gridTemplateColumns={`repeat(${Object.keys(days).length + 11}, minmax(40px, 1fr))`}>
								<StyledTableCell sx={{ justifyContent: "center" }}>
									<Typography variant="subtitle2">{index + 1}</Typography>
								</StyledTableCell>
								<StyledTableCell sx={{ gridColumn: "span 4", paddingLeft: "2px" }}>
									<Typography variant="subtitle2" sx={{ fontSize: ".85rem", textTransform: "capitalize" }}>{pos[0]}</Typography>
								</StyledTableCell>
								{Object.entries(days).map(([d, v]) => {
									const val = v === null ? 0 : v?.positions[pos[0]] || 0;
									return (
										<StyledTableCell sx={{ justifyContent: "center", backgroundColor: val === 0 ? "#ebebeb" : "#8db4e2" }} key={d}>
											<Typography variant="subtitle2">{val}</Typography>
										</StyledTableCell>
									)
								})}
								<StyledTableCell sx={{ gridColumn: "span 2" }}>
									<Typography variant="subtitle2" textAlign="center" width={1}>{pos[1].mp}</Typography>
								</StyledTableCell>
								<StyledTableCell sx={{ gridColumn: "span 2" }}>
									<Typography variant="subtitle2" textAlign="center" width={1}>{pos[1].mh}</Typography>
								</StyledTableCell>
							</Box>
						</Stack>
					)
				})}
				<Stack width={1} minWidth={(theme) => theme.breakpoints.values.lg} borderLeft={1}>
					<StyledGridBox gridTemplateColumns={`repeat(${Object.keys(days).length + 11}, minmax(40px, 1fr))`}>
						<StyledTableCell sx={{ gridColumn: "span 5", justifyContent: "right" }}>
							<Typography variant="subtitle2" fontWeight={700} sx={{ paddingRight: "4px" }}>Total Manpower</Typography>
						</StyledTableCell>
						{Object.entries(days).map(([d, v]) => (
							<StyledTableCell sx={{ justifyContent: "center" }} key={d}>
								<Typography variant="subtitle2">{v?.manpower || 0}</Typography>
							</StyledTableCell>
						))}
						<StyledTableCell sx={{ gridColumn: "span 2" }}>
							<Typography variant="subtitle2" textAlign="center" fontWeight={700} width={1}>{tbtTotal?.totalManpower}</Typography>
						</StyledTableCell>
						<StyledTableCell sx={{ gridColumn: "span 2" }}>
							<Typography variant="subtitle2" textAlign="center" fontWeight={700} width={1}>{tbtTotal?.totalManhours}</Typography>
						</StyledTableCell>
					</StyledGridBox>
					<StyledGridBox gridTemplateColumns={`repeat(${Object.keys(days).length + 11}, minmax(40px, 1fr))`}>
						<StyledTableCell sx={{ gridColumn: "span 5", justifyContent: "right" }}>
							<Typography variant="subtitle2" fontWeight={700} sx={{ paddingRight: "4px" }}>Hours Work</Typography>
						</StyledTableCell>
						{Object.keys(days).map((d) => (
							<StyledTableCell sx={{ justifyContent: "center" }} key={d}><Typography variant="subtitle2">9</Typography></StyledTableCell>
						))}
						<StyledTableCell sx={{ gridColumn: "span 2" }}>
							<Typography variant="subtitle2" textAlign="center" width={1}>9</Typography>
						</StyledTableCell>
						<StyledTableCell sx={{ gridColumn: "span 2" }}>
						</StyledTableCell>
					</StyledGridBox>
					<StyledGridBox gridTemplateColumns={`repeat(${Object.keys(days).length + 11}, minmax(40px, 1fr))`}>
						<StyledTableCell sx={{ gridColumn: "span 5", justifyContent: "right" }}>
							<Typography variant="subtitle2" fontWeight={700} sx={{ paddingRight: "4px" }}>Total Manhours</Typography>
						</StyledTableCell>
						{Object.entries(days).map(([d, v]) => {
							return (
								<StyledTableCell sx={{ justifyContent: "center" }} key={d}><Typography variant="subtitle2">{v?.manpower ? v.manpower * 9 : 0}</Typography></StyledTableCell>
							)
						})}
						<StyledTableCell sx={{ gridColumn: "span 2" }}>
							<Typography variant="subtitle2" textAlign="center" fontWeight={700} width={1}>{tbtTotal?.totalManpower}</Typography>
						</StyledTableCell>
						<StyledTableCell sx={{ gridColumn: "span 2" }}>
							<Typography variant="subtitle2" textAlign="center" fontWeight={700} width={1}>{tbtTotal?.totalManhours}</Typography>
						</StyledTableCell>
					</StyledGridBox>
				</Stack>
			</Scrollbar>
		)
	)
}

export default TBTReportTable