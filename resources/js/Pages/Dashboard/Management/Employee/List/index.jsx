import { lazy, Suspense } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const EmployeeListPage = lazy(() => import("./EmployeeListPage"));

const index = ({ employees, unassignedUsers }) => {

	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<EmployeeListPage employees={employees} unassignedUsers={unassignedUsers} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index