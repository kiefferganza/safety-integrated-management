import { Suspense, lazy } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import { Head } from '@inertiajs/inertia-react';
const ReportListPage = lazy(() => import("./ReportListPage"));

const index = ({ incidents }) => {

	return (
		<>
			<Head>
				<title>Incident Report List</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ReportListPage incidents={incidents} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index