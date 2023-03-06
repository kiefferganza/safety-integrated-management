import { lazy, Suspense } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const UserListPage = lazy(() => import("./UserListPage"));

const index = ({ users }) => {
	return (
		<>
			<Head>
				<title>User List</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<UserListPage users={users} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index