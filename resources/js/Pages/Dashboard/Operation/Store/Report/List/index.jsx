import { Suspense, lazy } from "react";
import { Head } from '@inertiajs/inertia-react';
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const StoreReportListPage = lazy(() => import("./StoreReportListPage"));

const index = ({ storeReports }) => {
	return (
		<>
			<Head>
				<title> Store: Report List</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<StoreReportListPage storeReports={storeReports} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index