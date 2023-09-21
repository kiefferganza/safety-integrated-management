import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { Head } from "@inertiajs/inertia-react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const TrainingCoursesListPage = lazy(() => import("./TrainingCoursesListPage"));

export default function index ({ courses }) {
	return (
		<>
			<Head>
				<title>Registered Courses</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<TrainingCoursesListPage courses={courses} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}
