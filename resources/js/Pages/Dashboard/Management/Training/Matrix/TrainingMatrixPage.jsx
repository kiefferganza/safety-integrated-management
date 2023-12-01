import { useState } from "react";
import { useDateRangePicker } from "@/Components/date-range-picker";
import DateRangePicker from "@/Components/date-range-picker/DateRangePicker";
import Iconify from "@/Components/iconify";
import LoadingScreen from "@/Components/loading-screen";
import Scrollbar from "@/Components/scrollbar/Scrollbar";
import { Inertia } from "@inertiajs/inertia";
import { Box, Button, Card, Divider, Grid, IconButton, Stack, Tooltip, Typography, styled } from "@mui/material";
import { format, startOfMonth, endOfMonth } from 'date-fns';

const TableHead = styled(Stack)(() => ({
	backgroundColor: '#305496',
	height: '100%',
	borderLeft: '1px solid #000',
	borderTop: '1px solid #000',
	borderBottom: '1px solid #000',
	width: 'fit-content',
}));

const TableBody = styled(Stack)(() => ({
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
	"Safety Officer": "#8bc34a",
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

export default function TrainingMatrixPage ({ titles, years, yearList, from, to }) {
	const [loading, setLoading] = useState(false);
	const {
		startDate,
		endDate,
		open: openPicker,
		onOpen: onOpenPicker,
		onClose: onClosePicker,
		isSelected: isSelectedValuePicker,
		isError,
		label,
		setStartDate,
		setEndDate
	} = useDateRangePicker(new Date(from), new Date(to));

	const handleStartDateChange = (date) => {
		setStartDate(startOfMonth(date));
	}

	const handleEndDateChange = (date) => {
		setEndDate(endOfMonth(date));
	}

	const handleOnFilterDate = () => {
		const routeName = route('training.management.matrix', {
			_query: {
				from: format(startDate, 'yyyy-MM-dd'),
				to: format(endDate, 'yyyy-MM-dd')
			}
		});
		Inertia.visit(routeName, {
			preserveScroll: true,
			preserveState: true,
			only: [
				'years',
				'from',
				'to',
				'titles'
			],
			onStart () {
				setLoading(true);
			},
			onFinish () {
				setLoading(false);
				onClosePicker();
			}
		});
	}

	const handleClosePicker = () => {
		setStartDate(new Date(from));
		setEndDate(new Date(to));
		onClosePicker();
	}

	const disableDate = (years) => {
		return (date) => {
			return years.indexOf(date.getFullYear()) === -1;
		};
	};

	if (loading) {
		return (
			<LoadingScreen />
		)
	}

	return (
		<>
			<Card sx={{ p: 2 }}>
				<Grid container mb={3}>
					<Grid item sm={12} md={2} lg={2} />
					<Grid item sm={12} md={10} lg={10}>
						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Typography variant="subtitle2" sx={{ fontWeight: '700' }}>Position Legend:</Typography>
							<Stack direction="row" alignItems="center" gap={1}>
								<Stack direction="row" alignItems="center" gap={1}>
									<Typography variant="subtitle2" sx={{ fontWeight: '700', whiteSpace: 'nowrap' }}>Completed: </Typography>
									<Box width="50%">
										<Box width={60} height={25} bgcolor="#808080" border="0.25px solid" />
									</Box>
								</Stack>
								<Stack direction="row" alignItems="center" gap={1}>
									<Typography variant="subtitle2" sx={{ fontWeight: '700', whiteSpace: 'nowrap' }}>Not Completed: </Typography>
									<Box width="50%">
										<Box width={60} height={25} bgcolor="#ffa500" border="0.25px solid" />
									</Box>
								</Stack>
								<Stack direction="row" alignItems="center" gap={1}>
									<Typography variant="subtitle2" sx={{ fontWeight: '700', whiteSpace: 'nowrap' }}>Expired: </Typography>
									<Box width="50%">
										<Box width={60} height={25} bgcolor="#d50000" border="0.25px solid" />
									</Box>
								</Stack>
							</Stack>
						</Stack>
						<Divider sx={{ my: 1 }} />
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
							<Typography variant="subtitle2" gutterBottom>Filter Date</Typography>
							{isSelectedValuePicker ? (
								<Button
									onClick={onOpenPicker}
									variant="outlined"
								>
									{label}
								</Button>
							) : (
								<Tooltip title="Due date">
									<IconButton size="small" onClick={onOpenPicker}>
										<Iconify icon="eva:calendar-fill" />
									</IconButton>
								</Tooltip>
							)}
						</Stack>
					</Grid>
				</Grid>
				<Stack gap={5}>
					{Object.entries(years).length > 0 && (
						Object.entries(years).map(([year, data], idx) => (
							<Stack width={1} key={idx}>
								<Typography variant="h6" textAlign="center">Training Matrix - YEAR {year}</Typography>
								<Scrollbar autoHide={false} sx={{ maxHeight: 900 }}>
									<Stack>
										<MatrixTable titles={titles} data={data} />
									</Stack>
								</Scrollbar>
							</Stack>
						))
					)}
				</Stack>
			</Card>
			<DateRangePicker
				variant="calendar"
				title="Choose training date"
				startDate={startDate}
				endDate={endDate}
				onChangeStartDate={handleStartDateChange}
				onChangeEndDate={handleEndDateChange}
				open={openPicker}
				onClose={handleClosePicker}
				isSelected={isSelectedValuePicker}
				isError={isError}
				onApply={handleOnFilterDate}
				StartDateProps={{
					shouldDisableDate: disableDate(yearList),
					shouldDisableYear: disableDate(yearList),
					views: ['year', 'month'],
					openTo: "year"
				}}
				EndDateProps={{
					shouldDisableDate: disableDate(yearList),
					shouldDisableYear: disableDate(yearList),
					views: ['year', 'month'],
					openTo: "year"
				}}
			/>
		</>
	)
}


function MatrixTable ({ titles, data }) {

	return (
		<Scrollbar autoHide={false}>
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
									<Box width={1} height={1} bgcolor={course ? (course.expired ? '#d50000' : (course.isCompleted ? '#808080' : '#ffa500')) : (POSITIONS[d.position] || 'transparent')} />
								</TableCell>
							)
						})}
					</TableBody>
				))}
			</Box>
		</Scrollbar>
	)
}