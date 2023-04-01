import { Suspense, lazy } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
const ThirdPartyTrainingListPage = lazy(() => import('./ThirdPartyTrainingListPage'));

const index = ({ trainings, url, type }) => {

	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<ThirdPartyTrainingListPage trainings={trainings} url={url} type={type} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index