import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import { lazy, Suspense } from "react";
const UserCreatePage = lazy(() => import("./UserCreatePage"));

const index = ({ employees }) => {
	return (
		<>
			<Head>
				<title>User: Create</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<UserCreatePage employees={employees} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index