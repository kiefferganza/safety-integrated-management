import { lazy, Suspense } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const EmployeeCreateEditPage = lazy(() => import("../EmployeeCreateEditPage"));

const index = ({ currentEmployee, companies, departments, positions }) => {
	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<EmployeeCreateEditPage
					currentEmployee={currentEmployee}
					companies={companies}
					departments={departments}
					positions={positions}
					isEdit={true}
				/>
			</DashboardLayout>
		</Suspense>
	)
}

export default index