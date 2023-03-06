import { Suspense, lazy } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
const TrainingList = lazy(() => import('./TrainingList'));

const index = ({ trainings, module, url, type }) => {

	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<TrainingList trainings={trainings} module={module} url={url} type={type} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index