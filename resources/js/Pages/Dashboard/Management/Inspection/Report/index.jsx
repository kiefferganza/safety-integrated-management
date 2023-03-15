import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
const InspectionReportPage = lazy(() => import("./InspectionReportPage"));

const index = ({ inspectionReport }) => {
	return (
		<>
			<Head>
				<title>Site Inspection: Report</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<InspectionReportPage inspectionReport={inspectionReport} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index