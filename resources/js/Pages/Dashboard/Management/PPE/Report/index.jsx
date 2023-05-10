import { Suspense, lazy } from "react";
import { Head } from '@inertiajs/inertia-react';
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const PPEReportPage = lazy(() => import("./PPEReportPage"));

const index = ({ inventories, employees, sequence_no, submittedDates }) => {
	return (
		<>
			<Head>
				<title> PPE: Report</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<PPEReportPage inventories={inventories} employees={employees} sequence_no={sequence_no} submittedDates={submittedDates} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index