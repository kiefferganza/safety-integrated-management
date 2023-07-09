import { Suspense, lazy } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import { Head } from '@inertiajs/inertia-react';
const StoreListPage = lazy(() => import("./StoreListPage"));

const index = ({ stores }) => {

	return (
		<>
			<Head>
				<title>Store List</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<StoreListPage stores={stores} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index