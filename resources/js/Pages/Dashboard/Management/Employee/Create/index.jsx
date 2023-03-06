import { lazy, Suspense } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const EmployeeCreateEditPage = lazy(() => import("../EmployeeCreateEditPage"));

const index = ({ companies, departments, positions, users }) => {
	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<EmployeeCreateEditPage
					currentEmployee={null}
					companies={companies}
					departments={departments}
					positions={positions}
					users={users}
				/>
			</DashboardLayout>
		</Suspense>
	)
}

export default index