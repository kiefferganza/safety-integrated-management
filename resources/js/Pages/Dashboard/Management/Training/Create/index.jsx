import { lazy, Suspense } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const TrainingEditCreatePage = lazy(() => import("../TrainingEditCreatePage"));

const index = ({ type, projectDetails }) => {
	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<TrainingEditCreatePage type={type} projectDetails={projectDetails} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index