import { Suspense, lazy } from "react";
import { Head } from '@inertiajs/inertia-react';
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const PPEReportListPage = lazy(() => import("./PPEReportListPage"));

const index = ({ inventoryReports }) => {
	return (
		<>
			<Head>
				<title> PPE: Report List</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<PPEReportListPage inventoryReports={inventoryReports} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index