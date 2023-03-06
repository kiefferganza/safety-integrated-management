import { Suspense, lazy } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
const InspectionListPage = lazy(() => import("./InspectionListPage"));

const index = ({ inspections, auth }) => {

	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<InspectionListPage inspections={inspections} user={auth?.user || {}} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index