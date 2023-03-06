import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import { lazy, Suspense } from "react";
const UserEditPage = lazy(() => import("./UserEditPage"));

const index = ({ user }) => {
	return (
		<>
			<Head>
				<title>User: Edit</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<UserEditPage user={user} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index