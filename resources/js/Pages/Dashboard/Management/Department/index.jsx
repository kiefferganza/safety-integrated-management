import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const DepartmentListPage = lazy(() => import("./DepartmentListPage"));

const index = ({ departments }) => {
	return (
		<>
			<Head>
				<title>Departments</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<DepartmentListPage departments={departments} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index