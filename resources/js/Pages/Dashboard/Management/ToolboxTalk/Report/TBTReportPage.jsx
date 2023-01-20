import { useEffect, useState } from 'react';
// mui
import { Box, Card, Checkbox, Container, FormControl, IconButton, InputLabel, ListItemText, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { StyledGridBox, StyledTableCell, StyledTableHead } from './tbtReportStyle';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// redux
import { dispatch, useSelector } from '@/redux/store';
// Components
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs/CustomBreadcrumbs';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { useSettingsContext } from '@/Components/settings';
import { getMonth, getYear } from 'date-fns';
import Scrollbar from '@/Components/scrollbar';
import Iconify from '@/Components/iconify';
import EmptyContent from '@/Components/empty-content';
import { convertTbtByYear, getTbts, } from '@/redux/slices/toolboxtalk';

const TODAY = new Date;
const CURRENT_MONTH = getMonth(TODAY) + 1;
const MONTH_NAMES = {
	1: 'January',
	2: 'February',
	3: 'March',
	4: 'April',
	5: 'May',
	6: 'June',
	7: 'July',
	8: 'August',
	9: 'September',
	10: 'October',
	11: 'November',
	12: 'December',
}

const TYPES = {
	'All': 0,
	'Civil': 1,
	'Electrical': 2,
	'Mechanical': 3,
	'Camp': 4,
	'Office': 5,
};

const TBTReportPage = ({ positions }) => {
	const { toolboxTalks, tbtByYear, tbtYearTotalByPosition, totalTbtByYear, isLoading } = useSelector(state => state.toolboxtalk);
	const { themeStretch } = useSettingsContext();
	const [yearSelected, setYearSelected] = useState(null);
	const [monthSelected, setMonthSelected] = useState(CURRENT_MONTH);
	const [filterType, setFilterType] = useState([
		'All',
		'Civil',
		'Electrical',
		'Mechanical',
		'Camp',
		'Office',
	]);

	useEffect(() => {
		if (tbtByYear === null || tbtYearTotalByPosition === null || toolboxTalks === null) {
			dispatch(getTbts());
		}
		if (yearSelected === null && tbtByYear !== null) {
			setYearSelected(Object.keys(tbtByYear).at(0) || 0);
		}
	}, [tbtByYear, tbtYearTotalByPosition, totalTbtByYear]);

	const handleDateChange = (value) => {
		setYearSelected(getYear(value));
		setMonthSelected(getMonth(value) + 1);
	}


	const handleFilterType = (event) => {
		const {
			target: { value },
		} = event;
		const isAll = value.some(val => val === "All");
		let newVal = typeof value === 'string' ? value.split(',') : value;

		const isAllChecked = filterType.some(val => val === "All");

		if (typeof value !== 'string') {
			if (isAllChecked && !isAll) {
				newVal = [];
			} else if (isAll && (newVal.length === 1 || newVal.at(-1) === "All")) {
				newVal = [
					'All',
					'Civil',
					'Electrical',
					'Mechanical',
					'Camp',
					'Office',
				]
			} else {
				newVal = value.filter(val => val !== "All");
			}
		}
		if (newVal.length > 0) {
			const types = newVal.map(ft => TYPES[ft]);
			const filteredTbt = toolboxTalks.filter((toolbox) => types.indexOf(+toolbox.tbt_type) !== -1);
			convertTbtByYear({ tbt: filteredTbt, positions });
		} else {
			convertTbtByYear({ tbt: toolboxTalks, positions });
		}
		setFilterType(newVal);
	};

	if (isLoading || !tbtByYear || yearSelected === null) {
		return <LoadingScreen />
	}

	if (Object.keys(tbtByYear).length === 0 || yearSelected === 0 || !(yearSelected in tbtByYear)) {
		return <NoData
			themeStretch={themeStretch}
			yearSelected={yearSelected}
			monthSelected={monthSelected}
			onChange={handleDateChange}
			filterType={filterType}
			onTypeChange={handleFilterType}
		/>
	}

	const handleNextMonth = () => {
		const m = monthSelected === 12 ? 1 : monthSelected + 1;
		setMonthSelected(m);
	}

	const handlePrevMonth = () => {
		const m = monthSelected === 1 ? 12 : monthSelected - 1;
		setMonthSelected(m);
	}

	const days = tbtByYear[yearSelected][monthSelected] || {};
	const positionData = tbtYearTotalByPosition[yearSelected][monthSelected] || {};
	const tbtTotal = totalTbtByYear[yearSelected][monthSelected] || {}

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'xl'}>
				<CustomBreadcrumbs
					heading="Toolbox Talk Report"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Toolbox Talk',
							href: PATH_DASHBOARD.toolboxTalks.root,
						},
						{
							name: 'Report',
						},
					]}
				/>
				<Card sx={{ p: 2 }}>
					<Stack direction="row" gap={1} justifyContent="end" sx={{ mb: 2 }}>
						<FormControl sx={{ width: 1, maxWidth: 140 }} size='small'>
							<InputLabel id="tbt-type-label">TBT Type</InputLabel>
							<Select
								labelId="tbt-type-label"
								id="tbt-type"
								label="TBT Type"
								multiple
								value={filterType}
								onChange={handleFilterType}
								renderValue={(selected) => selected.join(', ')}
								fullWidth
							>
								{Object.keys(TYPES).map((name) => (
									<MenuItem sx={{ px: 0 }} key={name} value={name}>
										<Checkbox checked={filterType?.indexOf(name) > -1} />
										<ListItemText primary={name} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<MobileDatePicker
							label="Select Date"
							value={new Date(yearSelected, monthSelected - 1, 1)}
							onChange={handleDateChange}
							inputFormat="MMM yyyy"
							openTo="year"
							showToolbar={false}
							views={['year', 'month']}
							renderInput={(params) => (
								<TextField
									{...params}
									size="small"
									fullWidth
									sx={{
										maxWidth: { md: 160 },
									}}
								/>
							)}
						/>
					</Stack>
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
						<Box>
							<IconButton size="large" onClick={handlePrevMonth}>
								<Iconify icon="material-symbols:chevron-left" />
							</IconButton>
						</Box>
						<Box>
							<Typography variant="h6">{MONTH_NAMES[monthSelected]} {yearSelected}</Typography>
						</Box>
						<Box>
							<IconButton size="large" onClick={handleNextMonth}>
								<Iconify icon="material-symbols:chevron-right" />
							</IconButton>
						</Box>
					</Stack>
					{Object.entries(positionData).length === 0 ? (
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
										<Typography variant="subtitle2" textAlign="center" width={1}></Typography>
									</StyledTableCell>
								</StyledGridBox>
							</Stack>
						</Scrollbar>
					)}
					{tbtTotal.totalManpowerAveDaysWork >= 0 && (
						<Stack alignItems="end" sx={{ my: 2 }}>
							<Box display="grid" gridTemplateColumns="220px 140px" border={1} borderBottom={0}>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} borderRight={1} sx={{ paddingLeft: "4px" }}>Total Manpower</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} textAlign="right" sx={{ color: "#5e6360", paddingRight: "4px" }}>{tbtTotal.totalManpower}</Typography>
								</Box>
							</Box>

							<Box display="grid" gridTemplateColumns="220px 140px" border={1} borderBottom={0}>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} borderRight={1} sx={{ paddingLeft: "4px" }}>Hours</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} textAlign="right" sx={{ color: "#5e6360", paddingRight: "4px" }}>9</Typography>
								</Box>
							</Box>

							<Box display="grid" gridTemplateColumns="220px 140px" border={1} borderBottom={0}>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} borderRight={1} sx={{ paddingLeft: "4px" }}>Total Manhours</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} textAlign="right" sx={{ color: "#5e6360", paddingRight: "4px" }}>{tbtTotal.totalManhours}</Typography>
								</Box>
							</Box>

							<Box display="grid" gridTemplateColumns="220px 140px" border={1} borderBottom={0}>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} borderRight={1} sx={{ paddingLeft: "4px" }}>Safe Manhours</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} textAlign="right" sx={{ color: "#5e6360", paddingRight: "4px" }}>{tbtTotal.safeManhours}</Typography>
								</Box>
							</Box>

							<Box display="grid" gridTemplateColumns="220px 140px" border={1} borderBottom={0}>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} borderRight={1} sx={{ paddingLeft: "4px" }}>Manpower Ave./Days Work</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} textAlign="right" sx={{ color: "#5e6360", paddingRight: "4px" }}>{tbtTotal.totalManpowerAveDaysWork}</Typography>
								</Box>
							</Box>

							<Box display="grid" gridTemplateColumns="220px 140px" border={1} borderBottom={0}>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} borderRight={1} sx={{ paddingLeft: "4px" }}>Manpower Ave./Day</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} textAlign="right" sx={{ color: "#5e6360", paddingRight: "4px" }}>{tbtTotal.totalManpowerAveDay}</Typography>
								</Box>
							</Box>

							<Box display="grid" gridTemplateColumns="220px 140px" border={1} borderBottom={0}>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} borderRight={1} sx={{ paddingLeft: "4px" }}>Days Work</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} textAlign="right" sx={{ color: "#5e6360", paddingRight: "4px" }}>{tbtTotal.daysWork}</Typography>
								</Box>
							</Box>

							<Box display="grid" gridTemplateColumns="220px 140px" border={1}>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} borderRight={1} sx={{ paddingLeft: "4px" }}>Days w/o Work</Typography>
								</Box>
								<Box>
									<Typography variant="subtitle1" fontWeight={700} textAlign="right" sx={{ color: "#5e6360", paddingRight: "4px" }}>{tbtTotal.daysWoWork}</Typography>
								</Box>
							</Box>
						</Stack>
					)}
				</Card>
			</Container>
		</>
	)
}


function NoData ({ themeStretch, yearSelected, monthSelected, onChange, filterType, onTypeChange }) {
	return (
		<Container maxWidth={themeStretch ? false : 'xl'}>
			<CustomBreadcrumbs
				heading="Toolbox Talk Report"
				links={[
					{
						name: 'Dashboard',
						href: PATH_DASHBOARD.root,
					},
					{
						name: 'Toolbox Talk',
						href: PATH_DASHBOARD.toolboxTalks.root,
					},
					{
						name: 'Report',
					},
				]}
			/>
			<Card sx={{ p: 2 }}>
				<Stack direction="row" gap={1} justifyContent="end">
					<FormControl sx={{ width: 1, maxWidth: 140 }} size='small'>
						<InputLabel id="tbt-type-label">TBT Type</InputLabel>
						<Select
							labelId="tbt-type-label"
							id="tbt-type"
							label="TBT Type"
							multiple
							value={filterType}
							onChange={onTypeChange}
							renderValue={(selected) => selected.join(', ')}
							fullWidth
						>
							{Object.keys(TYPES).map((name) => (
								<MenuItem sx={{ px: 0 }} key={name} value={name}>
									<Checkbox checked={filterType?.indexOf(name) > -1} />
									<ListItemText primary={name} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<MobileDatePicker
						label="Select Date"
						value={new Date(yearSelected || 2022, monthSelected - 1, 1)}
						onChange={onChange}
						inputFormat="MMM yyyy"
						openTo="year"
						showToolbar={false}
						views={['year', 'month']}
						renderInput={(params) => (
							<TextField
								{...params}
								fullWidth
								size="small"
								sx={{
									maxWidth: { md: 160 },
								}}
							/>
						)}
					/>
				</Stack>
				<EmptyContent
					title="No Data"
					sx={{
						'& span.MuiBox-root': { height: 160 },
					}}
				/>
			</Card>
		</Container>
	)
}

export default TBTReportPage