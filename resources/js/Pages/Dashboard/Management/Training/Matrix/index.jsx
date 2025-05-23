import { Suspense, lazy } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import { Head } from '@inertiajs/inertia-react';
import { useSettingsContext } from '@/Components/settings';
import { PATH_DASHBOARD } from '@/routes/paths';
const MatrixToolbar = lazy(() => import('@/sections/@dashboard/training/details/matrix/MatrixToolbar'));
const CustomBreadcrumbs = lazy(() => import('@/Components/custom-breadcrumbs/CustomBreadcrumbs'));
const Container = lazy(() => import('@mui/material/Container'));
const TrainingMatrixPage = lazy(() => import('./TrainingMatrixPage'));

const index = ({ titles, years, yearList, from, to }) => {
	const { themeStretch } = useSettingsContext();

	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<Head>
					<title>Training Matrix</title>
				</Head>

				<Container maxWidth={themeStretch ? false : 'lg'}>
					<CustomBreadcrumbs
						heading={'Matrix'}
						links={[
							{
								name: 'Dashboard',
								href: PATH_DASHBOARD.root,
							},
							{
								name: 'List',
								href: PATH_DASHBOARD.training.client,
							},
							{
								name: 'Training Matrix',
							},
						]}
					/>
					<MatrixToolbar titles={titles} years={years} from={from} to={to} />
					<TrainingMatrixPage
						titles={titles}
						years={years}
						yearList={yearList}
						from={from}
						to={to}
					/>
				</Container>
			</DashboardLayout>
		</Suspense>
	)
}

export default index