import { lazy, Suspense } from 'react';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { getCurrentUserName } from "@/utils/formatName";
import { Head } from "@inertiajs/inertia-react";
const EmployeeProfilePage = lazy(() => import("./EmployeeProfilePage"));

const index = ({ employee }) => {

	return (
		<>
			<Head>
				<title>{`${getCurrentUserName(employee)} Profile`}</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<EmployeeProfilePage employee={employee} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index