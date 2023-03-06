import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const TBTStatisticPage = lazy(() => import("./TBTStatisticPage"));

const index = ({ statistics }) => {
	return (
		<>
			<Head>
				<title>Statistic - Toolbox Talks</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<TBTStatisticPage statistics={statistics} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index