import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { Head } from "@inertiajs/inertia-react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const TrainingInHouseCoursesListPage = lazy(() => import("./TrainingInHouseCoursesListPage"));

export default function index ({ courses }) {
	return (
		<>
			<Head>
				<title>Registered In House Courses</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<TrainingInHouseCoursesListPage courses={courses} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}
