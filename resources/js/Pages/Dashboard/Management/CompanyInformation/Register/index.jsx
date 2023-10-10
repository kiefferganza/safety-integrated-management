import { lazy, Suspense } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const ProjectDetailList = lazy(() => import("./ProjectDetailList"));

const index = ({ projectDetails, titles }) => {

	return (
		<>
			<Head>
				<title>Register</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ProjectDetailList projectDetails={projectDetails} titles={titles} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index