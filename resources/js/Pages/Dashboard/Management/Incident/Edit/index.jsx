import { lazy, Suspense } from 'react';
import { Head } from '@inertiajs/inertia-react';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
// @mui
const Container = lazy(() => import('@mui/material/Container'));
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
const IncidentNewForm = lazy(() => import('@/sections/@dashboard/incident/form/IncidentNewEditForm'));
const CustomBreadcrumbs = lazy(() => import('@/Components/custom-breadcrumbs'));

const index = ({ incident, projectDetails }) => {
	const { themeStretch } = useSettingsContext();
	return (
		<>
			<Head>
				<title>Edit Incident</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>

					<Container maxWidth={themeStretch ? false : 'lg'}>
						<CustomBreadcrumbs
							heading={incident?.form_number}
							links={[
								{
									name: 'Dashboard',
									href: PATH_DASHBOARD.root,
								},
								{
									name: 'Incidents',
									href: PATH_DASHBOARD.incident.root,
								},
								{
									name: "Edit Incident",
								},
							]}
						/>
						<IncidentNewForm currentIncident={incident} isEdit projectDetails={projectDetails} />
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index