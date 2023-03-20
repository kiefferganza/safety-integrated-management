import { Fragment, useEffect, useState } from 'react';
import { PATH_DASHBOARD } from '@/routes/paths';
// redux
import { dispatch, useSelector } from '@/redux/store';
import { getTbts, } from '@/redux/slices/toolboxtalk';
// mui
const { Box, Card, Container, Typography, Divider, useTheme, Stack, Button, Link, IconButton } = await import('@mui/material');
// Components
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs/CustomBreadcrumbs';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { useSettingsContext } from '@/Components/settings';
import Scrollbar from '@/Components/scrollbar';
import { StyledGridBox, StyledTableCell, StyledTableHead, StyledTableHeader } from './tbtStatisticStyle';
import ToolboxTalkAnalytic from '@/sections/@dashboard/toolboxtalks/ToolboxTalkAnalytic';
import Iconify from '@/Components/iconify';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
const { ConfirmDialog } = await import('@/Components/confirm-dialog/ConfirmDialog');
const { TBTNewEditStatisTicDialog } = await import('@/sections/@dashboard/toolboxtalks/portal/TBTNewEditStatisTicDialog');

const TABLE_HEAD = [
	{ label: "Year" },
	{ label: "Jan", subHeading: true },
	{ label: "Feb", subHeading: true },
	{ label: "Mar", subHeading: true },
	{ label: "Apr", subHeading: true },
	{ label: "May", subHeading: true },
	{ label: "Jun", subHeading: true },
	{ label: "Jul", subHeading: true },
	{ label: "Aug", subHeading: true },
	{ label: "Sep", subHeading: true },
	{ label: "Oct", subHeading: true },
	{ label: "Nov", subHeading: true },
	{ label: "Dec", subHeading: true },
	{ label: "Attach. File" },
	{ label: "Avg. Manpower" },
	{ label: "Total Manpower" },
	{ label: "Total Manhours" },
];

const EMPTY_TABLE_ROW = [null, null, null, null, null, null, null, null, null, null, null, null];


const TBTStatisticPage = ({ statistics = [] }) => {
	const { load, stop } = useSwal();
	const { totalTbtByYear, isLoading } = useSelector(state => state.toolboxtalk);

	const { themeStretch } = useSettingsContext();
	const theme = useTheme();

	const [data, setData] = useState([]);
	const [selectedStat, setSelectedStat] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const [openStat, setOpenStat] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);

	useEffect(() => {
		if (totalTbtByYear === null) {
			dispatch(getTbts());
		} else {
			const years = generateArrayOfYears();
			const totalTbtByYearData = years.map(y => {
				if (y[0] in totalTbtByYear) {
					return [
						y[0],
						Object.values(totalTbtByYear[y[0]])
					]
				}
				return y;
			});

			const mergedData = totalTbtByYearData.map(([year, data]) => {
				const findStat = statistics.find(stat => +stat.year === year);
				if (findStat) {
					if (data === null) {
						return [year, findStat.months.sort((a, b) => a.month_code - b.month_code).map(m => ({
							...m,
							totalManhours: m.manhours,
							totalManpower: m.manpower
						})), findStat.src, findStat.id];
					} else {
						const months = findStat.months.map(month => ({
							...totalTbtByYear[year][month.month_code],
							totalManpower: totalTbtByYear[year][month.month_code].totalManpower + month.manpower,
							totalManhours: totalTbtByYear[year][month.month_code].totalManhours + month.manhours
						}));
						return [year, months, findStat.src, findStat.id]
					}
				} else {
					return [year, data];
				}
			}).filter(d => d[1] !== null);
			setData(mergedData);
		}
	}, [totalTbtByYear, statistics]);


	const handleOpenStat = (id) => {
		if (id) {
			const stat = statistics.find(stat => stat.id === id);
			if (stat) {
				setSelectedStat(stat);
			}
		}
		setOpenStat(true);
	}

	const handleCloseStat = () => {
		if (!selectedStat) {
			setOpenStat(false);
		} else {
			setSelectedStat(null);
			setOpenStat(false);
		}
	}


	const handleDelete = () => {
		if (selectedId !== null) {
			Inertia.delete(PATH_DASHBOARD.toolboxTalks.deleteStatistic(selectedId), {
				preserveState: true,
				preserveScroll: true,
				onStart () {
					handleCloseConfirm();
					load("Deleting record", "please wait...");
				},
				onFinish () {
					stop();
				}
			})
		}
	}

	const handleOpenConfirm = (id) => {
		if (id) {
			setSelectedId(id);
			setOpenConfirm(true);
		}
	}

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
		setSelectedId(null);
	}


	if (isLoading || totalTbtByYear === null) {
		return <LoadingScreen />
	}

	const total = data.reduce((acc, curr) => {
		if (curr[1] !== null) {
			const totalByMonth = curr[1].reduce((innerCurr, innerAcc) => ({
				totalManpower: innerAcc.totalManpower + innerCurr.totalManpower,
				totalManhours: innerAcc.totalManhours + innerCurr.totalManhours
			}), {
				totalManpower: 0,
				totalManhours: 0
			});
			acc.totalManpower = acc.totalManpower + totalByMonth.totalManpower;
			acc.totalManhours = acc.totalManhours + totalByMonth.totalManhours;
		}
		return acc;
	}, {
		totalManpower: 0,
		totalManhours: 0
	});

	const disabledYears = statistics.map(a => +a.year);
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
					action={
						<Button
							variant="contained"
							startIcon={<Iconify icon="eva:plus-fill" />}
							onClick={handleOpenStat}
						>Insert Record</Button>
					}
				/>
				<Card sx={{ mb: 5 }}>
					<Scrollbar>
						<Stack
							direction="row"
							divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
							sx={{ py: 2 }}
						>
							<ToolboxTalkAnalytic
								title="Avg. Manpower/Month"
								total={Math.round(total?.totalManpower / 12)}
								percent={100}
								icon="akar-icons:people-group"
								color={theme.palette.success.main}
							/>

							<ToolboxTalkAnalytic
								title="Total Manpower"
								total={total.totalManpower}
								percent={100}
								icon="akar-icons:people-group"
								color={theme.palette.info.main}
							/>

							<ToolboxTalkAnalytic
								title="Total Manhours"
								total={total.totalManhours}
								percent={100}
								icon="tabler:clock-hour-3"
								color={theme.palette.warning.main}
							/>
						</Stack>
					</Scrollbar>
				</Card>
				<Card sx={{ p: 2 }}>
					<Scrollbar sx={{ py: 1 }}>
						<StyledGridBox>
							<StyledTableHeader gridColumn="1/-1">
								<Typography variant="h6">HSE HOURS WORKED RECORD</Typography>
							</StyledTableHeader>
							{TABLE_HEAD.map((row, idx) => (
								<StyledTableHead key={idx}>
									{row?.subHeading ? (
										<Stack width={1} sx={{ borderColor: theme.palette.grey.A700 }}>
											<Typography variant="subtitle2" textAlign="center">{row.label}</Typography>
											<Box borderTop={1} sx={{ borderColor: "inherit" }} display="flex" alignItems="center">
												<Box width={.5} textAlign="center" borderRight={1} sx={{ borderColor: "inherit" }}>
													<Typography variant="subtitle2">P</Typography>
												</Box>
												<Box width={.5} textAlign="center">
													<Typography variant="subtitle2">H</Typography>
												</Box>
											</Box>
										</Stack>
									) : (
										<Typography variant="subtitle2">{row.label}</Typography>
									)}
								</StyledTableHead>
							))}
							<StyledTableHead></StyledTableHead>
							{data.map((row, idx) => {
								const innerRowData = row[1] !== null ? row[1] : EMPTY_TABLE_ROW;
								const totals = row[1] !== null ? row[1].reduce((curr, acc) => ({
									totalManpower: acc.totalManpower + curr.totalManpower,
									totalManhours: acc.totalManhours + curr.totalManhours
								}), {
									totalManpower: 0,
									totalManhours: 0
								}) : null;

								return (
									<Fragment key={idx}>
										<StyledTableCell key={idx}>
											<Typography variant="subtitle2">{row[0]}</Typography>
										</StyledTableCell>
										{innerRowData.map((innerRow, innerIdx) => (
											<StyledTableCell key={innerIdx}>
												<Box sx={{ borderColor: "inherit" }} width={1} height={1} display="flex" alignItems="center">
													<Box width={.5} height={1} textAlign="center" borderRight={1} sx={{ borderColor: "inherit" }} display="flex" alignItems="center" justifyContent="center">
														<Typography variant="subtitle2" sx={{ wordBreak: "break-all" }}>{(Math.round(innerRow?.totalManpower) || 0)?.toLocaleString()}</Typography>
													</Box>
													<Box width={.5} height={1} textAlign="center" display="flex" alignItems="center" justifyContent="center">
														<Typography variant="subtitle2" sx={{ wordBreak: "break-all" }}>
															{(Math.round(innerRow?.totalManhours) || 0)?.toLocaleString()}
														</Typography>
													</Box>
												</Box>
											</StyledTableCell>
										))}
										<StyledTableCell>
											{row[2] ? (
												<Link target="_blank" rel="noopener noreferrer nofollow" href={row[2]}>Yes</Link>
											) : (
												<Typography variant="subtitle2">No</Typography>
											)}
										</StyledTableCell>
										<StyledTableCell>
											<Typography variant="subtitle2">{row[1] ? Math.round(totals?.totalManpower / 12) : 0}</Typography>
										</StyledTableCell>
										<StyledTableCell>
											<Typography variant="subtitle2">{row[1] ? Math.round(totals?.totalManpower)?.toLocaleString() : 0}</Typography>
										</StyledTableCell>
										<StyledTableCell sx={{ borderRightWidth: 1 }}>
											<Typography variant="subtitle2">{row[1] ? Math.round(totals?.totalManhours)?.toLocaleString() : 0}</Typography>
										</StyledTableCell>
										<StyledTableCell sx={{ borderRightWidth: 1 }}>
											<Stack direction="row" spacing={.5}>
												<IconButton size="small" onClick={() => row[3] !== undefined && handleOpenStat(row[3])} color="info" disabled={row[3] === undefined}>
													<Iconify sx={{ width: 18, height: 18 }} icon="eva:edit-fill" />
												</IconButton>
												<IconButton size="small" onClick={() => row[3] !== undefined && handleOpenConfirm(row[3])} color="error" disabled={row[3] === undefined}>
													<Iconify sx={{ width: 18, height: 18 }} icon="eva:trash-2-outline" />
												</IconButton>
											</Stack>
										</StyledTableCell>
									</Fragment>
								)
							})}
							<StyledTableCell gridColumn="16">
								<Typography variant="subtitle2">{(Math.round(total?.totalManpower) || 0).toLocaleString()}</Typography>
							</StyledTableCell>
							<StyledTableCell gridColumn="17" sx={{ borderRightWidth: 1 }}>
								<Typography variant="subtitle2">{(Math.round(total?.totalManhours) || 0).toLocaleString()}</Typography>
							</StyledTableCell>
						</StyledGridBox>
					</Scrollbar>
				</Card>
			</Container>
			<TBTNewEditStatisTicDialog
				open={openStat}
				onClose={handleCloseStat}
				yearsDisabled={disabledYears}
				statistic={selectedStat}
			/>
			<ConfirmDialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				title="Delete"
				content="Are you sure want to delete?"
				action={
					<Button variant="contained" color="error" onClick={handleDelete}>
						Delete
					</Button>
				}
			/>
		</>
	)
}

function generateArrayOfYears () {
	let max = new Date().getFullYear()
	let min = 1999;
	let years = [];

	for (let i = max; i >= min; i--) {
		years.unshift([i, null])
	}
	return years
}

export default TBTStatisticPage;