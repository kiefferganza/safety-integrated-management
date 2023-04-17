import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
// @mui
import { Container, Stack, Grid, Backdrop, CircularProgress } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import { CustomSmallSelect } from '@/Components/custom-input';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import IndicatorByMonth from '@/sections/@dashboard/incident/report/IndicatorByMonth';
import IndicatorTable from '@/sections/@dashboard/incident/report/IndicatorTable';
import RootCauseTable from '@/sections/@dashboard/incident/report/RootCauseTable';
import SeverityTable from '@/sections/@dashboard/incident/report/SeverityTable';
import IncidentReportTwoCols from '@/sections/@dashboard/incident/report/IncidentReportTwoCols';

// ----------------------------------------------------------------------

const ReportListPage = ({ incidents }) => {
	const [loading, setLoading] = useState(false);
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const { themeStretch } = useSettingsContext();

	const handleYearChange = (e) => {
		setSelectedYear(e.target.value);
		Inertia.get(route("incident.management.report"), { year: e.target.value }, {
			preserveScroll: true,
			preserveState: true,
			onStart () {
				setLoading(true);
			},
			onFinish () {
				setLoading(false);
			}
		});
	}

	const now = new Date().getUTCFullYear();
	const years = Array(now - (now - 10)).fill('').map((_v, idx) => now - idx).reverse();
	console.log(incidents);
	return (
		<>
			<Backdrop open={loading} sx={{ overflow: "hidden" }}>
				<CircularProgress color="primary" />
			</Backdrop>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading={`Incidents Classification ${selectedYear}`}
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{ name: 'List', href: PATH_DASHBOARD.incident.root },
						{ name: 'Report' },
					]}
					action={
						<CustomSmallSelect value={selectedYear} onChange={handleYearChange}>
							{years.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</CustomSmallSelect>
					}
				/>
				<Stack spacing={3}>
					<Grid container spacing={2}>
						<Grid item md={6} sm={12}>
							<IndicatorByMonth indicator={incidents?.indicator || {}} indicatorTotal={incidents?.indicatorTotal || 0} />
						</Grid>
						<Grid item md={6} sm={12}>
							<Stack spacing={2} height={1}>
								<IndicatorTable indicator={incidents?.indicator || {}} />
								<RootCauseTable rootCause={incidents?.root_cause || {}} />
							</Stack>
						</Grid>
					</Grid>

					<Grid container spacing={2}>
						<Grid item md={6} sm={12}>
							<Stack spacing={2} height={1}>
								<SeverityTable severity={incidents?.severity || {}} total={incidents?.severityTotal || 0} />
								<IncidentReportTwoCols
									title="Mechanism of Injury"
									firstColTitle="MECHANISM"
									data={incidents?.mechanism || {}}
									total={incidents?.mechanismTotal || 0}
								/>
							</Stack>
						</Grid>
						<Grid item md={6} sm={12}>
							<IncidentReportTwoCols
								title="Body Parts Injured"
								firstColTitle="BODY PART"
								data={incidents?.body_part || {}}
								total={incidents?.bodyPartTotal || 0}
							/>
						</Grid>
					</Grid>

					<Grid container spacing={2}>
						<Grid item md={6} sm={12}>
							<Stack spacing={2} height={1}>
								<IncidentReportTwoCols
									title="Equipments Involved"
									firstColTitle="Equipment"
									data={incidents?.equipment || {}}
									total={incidents?.equipmentTotal || 0}
								/>
								{/* <SeverityTable severity={incidents?.severity || {}} total={incidents?.severityTotal || 0} /> */}
							</Stack>
						</Grid>
						<Grid item md={6} sm={12}>
							<IncidentReportTwoCols
								title="Nature of Injury"
								firstColTitle="NATURE"
								data={incidents?.nature || {}}
								total={incidents?.natureTotal || 0}
							/>
						</Grid>
					</Grid>
				</Stack>
			</Container>
		</>
	)
}

export default ReportListPage