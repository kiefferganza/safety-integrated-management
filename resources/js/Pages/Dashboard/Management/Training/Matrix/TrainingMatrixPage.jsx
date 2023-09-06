import Scrollbar from "@/Components/scrollbar/Scrollbar";
import { Box, Card, Grid, Stack, TextField, Typography, styled } from "@mui/material";
import { useState } from "react";
const TableHead = styled(Stack)(({ theme }) => ({
	backgroundColor: '#305496',
	height: '100%',
	borderLeft: '1px solid #000',
	borderTop: '1px solid #000',
	borderBottom: '1px solid #000',
	width: 'fit-content',
}));

const TableBody = styled(Stack)(({ theme }) => ({
	height: '100%',
	width: 'fit-content',
	borderLeft: '1px solid #000',
	borderTop: '1px solid #000',
	borderBottom: '1px solid #000',
}));

const TableHeadCell = styled(Box)`
	height: auto;
	border-right: 1px solid #000;
	padding: 4px 8px;
	min-width: 65px;
	&>div {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		&>p {
			color: #ffffff;
			transform-origin: left bottom;
			white-space: nowrap;
			padding: 4px;
			&.vertical {
				writing-mode: vertical-lr;
			}
		}
	}
`

const TableCell = styled(Box)`
	height: auto;
	border-right: 1px solid #000;
	min-width: 65px;
	&>p {
		transform-origin: left bottom;
		white-space: nowrap;
		&.vertical {
			writing-mode: vertical-lr;
		}
	}
`


const POSITIONS = {
	"Driver": "#2f75b5",
	"HSE Deputy": "#c6e0b4",
	"PA/Safety Officer": "#ab0cff",
	"PA/Supervisor": "#85660c",
	"Electrician": "#782ab7",
	"Painter": "#1c8356",
	"laborer": "#17ff32",
	"Worker": "#ebd29e",
	"PA": "#e3e3e3",
	"Welder": "#1cbf4e",
	"Scaffolder": "#c5441c",
	"Mechanical Technician": "#dfa1fe",
	"Carpenter": "#ff00fc",
	"Safety Officer": "#ffaf16",
	"Engineer": "#f9a19f",
	"Grinder": "#91ad1c",
	"Site Supervisor": "#1cffcf",
	"QA/QC Engineer": "#2ed9ff",
	"Foreman": "#b10ca1",
	"Civil Manager": "#00b0f0",
	"Logistic": "#c174a7",
	"PA/Engineer": "#795548",
	"Surveyor": "#fe1cbf",
	"Storekeeper": "#b10068",
	"Security Guard": "#fae326",
	"Planner Engineer": "#e6ee9c",
};

export default function TrainingMatrixPage ({ titles, years }) {
	const [selectedYear, setSelectedYear] = useState('all');

	const handleYearChange = (e) => {
		setSelectedYear(e.currentTarget.value);
	}

	return (
		<Card sx={{ p: 2 }}>
			<Grid container mb={3}>
				<Grid item sm={12} md={2} lg={2} />
				<Grid item sm={12} md={10} lg={10}>
					<Typography varian="subtitle2" sx={{ fontWeight: '700' }} gutterBottom>Position Legend:</Typography>
					<Stack direction="row" justifyContent="space-between" flexWrap="wrap">
						{Object.entries(POSITIONS).map(([pos, color]) => (
							<Stack direction="row" width={"33%"} key={pos}>
								<Box width="50%">
									<Typography variant="subtitle2" sx={{ fontWeight: '600' }}>{pos}</Typography>
								</Box>
								<Box width="50%">
									<Box width={60} height={25} bgcolor={color} border="0.25px solid" />
								</Box>
							</Stack>
						))}
					</Stack>
					<Stack my={3} alignItems="flex-end">
						<TextField SelectProps={{ native: true }} onChange={handleYearChange} value={selectedYear} select label="Year" size="small" sx={{ minWidth: 160, marginRight: { sm: 0, md: '60px' } }}>
							<option value="all">All</option>
							{Object.keys(years).map(y => (
								<option value={y} key={y}>{y}</option>
							))}
						</TextField>
					</Stack>
				</Grid>
			</Grid>
			<Stack gap={5}>
				{Object.entries(years).length > 0 && (
					selectedYear !== 'all' ? (
						years[selectedYear] && (
							<Stack width={1}>
								<Typography variant="h6" textAlign="center">Training Matrix - YEAR {selectedYear}</Typography>
								<MatrixTable titles={titles} data={years[selectedYear]} />
							</Stack>
						)
					) : (
						Object.entries(years).map(([year, data], idx) => (
							<Stack width={1} key={idx}>
								<Typography variant="h6" textAlign="center">Training Matrix - YEAR {year}</Typography>
								<MatrixTable titles={titles} data={data} />
							</Stack>
						))
					)
				)}
			</Stack>
		</Card>
	)
}


function MatrixTable ({ titles, data }) {
	return (
		<Scrollbar>
			<Box>
				<TableHead direction="row">
					<TableHeadCell width={65}>
						<Box>
							<Typography color="inherit">S.no</Typography>
						</Box>
					</TableHeadCell>
					<TableHeadCell width={240}>
						<Box>
							<Typography color="inherit">Name</Typography>
						</Box>
					</TableHeadCell>
					<TableHeadCell width={200}>
						<Box>
							<Typography color="inherit">Position</Typography>
						</Box>
					</TableHeadCell>
					{titles?.map((title, idx) => (
						<TableHeadCell key={idx}>
							<Box>
								<Typography color="inherit" className="vertical">{title}</Typography>
							</Box>
						</TableHeadCell>
					))}
				</TableHead>
				{(data || [])?.map((d, i) => (
					<TableBody key={i} direction="row">
						<TableCell width={65}>
							<Typography component='p' variant="subtitle2" color="inherit" textAlign="center">{i + 1}</Typography>
						</TableCell>
						<TableCell width={240}>
							<Typography component='p' variant="subtitle2" color="inherit" pl={1}>{d.fullName}</Typography>
						</TableCell>
						<TableCell width={200}>
							<Typography component='p' variant="subtitle2" color="inherit" textTransform="capitalize" pl={1}>{d.position}</Typography>
						</TableCell>
						{titles?.map((title, idx) => {
							const course = d?.data?.find(d => d?.courseName?.trim()?.toLowerCase() === title?.trim()?.toLowerCase());
							return (
								<TableCell key={idx}>
									<Box width={1} height={1} bgcolor={course ? (course.isCompleted ? '#808080' : 'red') : (POSITIONS[d.position] || 'transparent')} />
								</TableCell>
							)
						})}
					</TableBody>
				))}
			</Box>
		</Scrollbar>
	)
}