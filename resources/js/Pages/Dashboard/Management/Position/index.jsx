import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const PositionListPage = lazy(() => import("./PositionListPage"));

const index = ({ positions }) => {

	return (
		<>
			<Head>
				<title>Positions</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<PositionListPage positions={positions} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index