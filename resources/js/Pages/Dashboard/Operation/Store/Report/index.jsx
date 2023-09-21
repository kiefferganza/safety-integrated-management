import { Suspense, lazy } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import { Head } from '@inertiajs/inertia-react';
const StoreCreateReportPage = lazy(() => import("./StoreCreateReportPage"));

const index = ({ stores, submittedDates, sequence_no, employees }) => {

	return (
		<>
			<Head>
				<title>Generate Store Report</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<StoreCreateReportPage stores={stores} submittedDates={submittedDates} sequence_no={sequence_no} employees={employees} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index