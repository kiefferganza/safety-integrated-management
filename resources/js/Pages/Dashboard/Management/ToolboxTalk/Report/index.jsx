import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
const TBTReportPage = lazy(() => import("./TBTReportPage"));

const index = () => {
	return (
		<>
			<Head>
				<title>Toolbox Talks: Report</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<TBTReportPage />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index