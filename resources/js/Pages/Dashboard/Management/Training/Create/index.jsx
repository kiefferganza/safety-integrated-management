import { lazy, Suspense } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const TrainingEditCreatePage = lazy(() => import("../TrainingEditCreatePage"));

const index = ({ type }) => {
	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<TrainingEditCreatePage type={type} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index