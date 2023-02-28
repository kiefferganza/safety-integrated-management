import { Fragment, useEffect, useState } from 'react';
import { PATH_DASHBOARD } from '@/routes/paths';
// redux
import { dispatch, useSelector } from '@/redux/store';
import { getTbts, } from '@/redux/slices/toolboxtalk';
// mui
const { Card, Container, Typography } = await import('@mui/material');
// Components
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs/CustomBreadcrumbs';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { useSettingsContext } from '@/Components/settings';
import Scrollbar from '@/Components/scrollbar';
import { StyledGridBox, StyledTableCell, StyledTableHead, StyledTableHeader } from './tbtStatisticStyle';

const TABLE_HEAD = [
	"Year",
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
	"Attach File",
	"Avg. Manpower",
	"Total Manpower",
	"Total Manhours",
];

const EMPTY_TABLE_ROW = [null, null, null, null, null, null, null, null, null, null, null, null];


const TBTStatisticPage = () => {
	const { totalTbtByYear, isLoading } = useSelector(state => state.toolboxtalk);

	const { themeStretch } = useSettingsContext();

	const [data, setData] = useState([]);

	useEffect(() => {
		if (totalTbtByYear === null) {
			dispatch(getTbts());
		} else {
			const years = generateArrayOfYears();
			const megredData = years.map(y => {
				if (y[0] in totalTbtByYear) {
					return [
						y[0],
						Object.values(totalTbtByYear[y[0]])
					]
				}
				return y;
			});
			setData(megredData);
		}
	}, [totalTbtByYear]);

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
				<Scrollbar sx={{ py: 1 }}>
					<StyledGridBox>
						<StyledTableHeader gridColumn="1/-1">
							<Typography variant="h6">HSE Statistic Record (Manhours)</Typography>
						</StyledTableHeader>
						{TABLE_HEAD.map((row, idx) => (
							<StyledTableHead key={idx}>
								<Typography variant="subtitle2">{row}</Typography>
							</StyledTableHead>
						))}
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
											<Typography variant="subtitle2">{(innerRow?.totalManhours || 0)?.toLocaleString()}</Typography>
										</StyledTableCell>
									))}
									<StyledTableCell>
										<Typography variant="subtitle2">No</Typography>
									</StyledTableCell>
									<StyledTableCell>
										<Typography variant="subtitle2">{row[1] ? Math.ceil(totals?.totalManpower / 12) : 0}</Typography>
									</StyledTableCell>
									<StyledTableCell>
										<Typography variant="subtitle2">{row[1] ? totals?.totalManpower?.toLocaleString() : 0}</Typography>
									</StyledTableCell>
									<StyledTableCell>
										<Typography variant="subtitle2">{row[1] ? totals?.totalManhours?.toLocaleString() : 0}</Typography>
									</StyledTableCell>
								</Fragment>
							)
						})}
						<StyledTableCell gridColumn="16">
							<Typography variant="subtitle2">{(total?.totalManpower || 0).toLocaleString()}</Typography>
						</StyledTableCell>
						<StyledTableCell gridColumn="17">
							<Typography variant="subtitle2">{(total?.totalManhours || 0).toLocaleString()}</Typography>
						</StyledTableCell>
					</StyledGridBox>
				</Scrollbar>
			</Card>
		</Container>
	)
}

function generateArrayOfYears () {
	let max = new Date().getFullYear()
	let min = 2013;
	let years = [];

	for (let i = max; i >= min; i--) {
		years.unshift([i, null])
	}
	return years
}

export default TBTStatisticPage;