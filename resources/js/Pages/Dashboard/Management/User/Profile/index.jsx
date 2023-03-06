import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { getCurrentUserName } from "@/utils/formatName";
import { Head } from "@inertiajs/inertia-react";
import { lazy, Suspense } from "react";
const UserProfilePage = lazy(() => import("./UserProfilePage"));

const index = ({ user }) => {
	return (
		<>
			<Head>
				<title>{getCurrentUserName(user)}</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<UserProfilePage user={user} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index