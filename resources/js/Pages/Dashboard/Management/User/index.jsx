import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import { lazy, Suspense } from "react";
const UserProfilePage = lazy(() => import("./UserProfilePage"));

const index = ({ auth, employee }) => {

	return (
		<>
			<Head>
				<title>Profile</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<UserProfilePage user={auth?.user || {}} employee={employee} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index