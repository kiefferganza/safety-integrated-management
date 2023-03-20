import { Suspense, lazy } from 'react';
import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import { Container } from '@mui/material';
import { Head } from '@inertiajs/inertia-react';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
const Review = lazy(() => import('@/sections/@dashboard/inspection/edit/Review'));
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';

const index = ({ inspection }) => {
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
							heading="Review Items"
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

						<Review inspection={inspection} />
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index