import { Suspense, lazy } from 'react';
import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import { Container } from '@mui/material';
import { Head } from '@inertiajs/inertia-react';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
const Verify = lazy(() => import('@/sections/@dashboard/inspection/edit/Verify'));
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';

const index = ({ inspection, rolloutDate }) => {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>Unsatisfactory Items</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<Container maxWidth={themeStretch ? false : 'lg'}>
						<CustomBreadcrumbs
							heading="Verify & Approve Items"
							links={[
								{
									name: 'Dashboard',
									href: PATH_DASHBOARD.root,
								},
								{
									name: 'List',
									href: PATH_DASHBOARD.inspection.list,
								},
								{
									name: "Detail",
									href: PATH_DASHBOARD.inspection.view(inspection.inspection_id),
								},
								{
									name: inspection?.form_number?.toUpperCase()
								},
							]}
						/>

						<Verify inspection={inspection} rolloutDate={rolloutDate} />
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index