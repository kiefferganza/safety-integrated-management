import { Suspense, lazy } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import { Head } from '@inertiajs/inertia-react';
const IncidentList = lazy(() => import("./IncidentList"));

const index = ({ incidents, types }) => {

	return (
		<>
			<Head>
				<title>Incident List</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<IncidentList incidents={incidents} types={types} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index