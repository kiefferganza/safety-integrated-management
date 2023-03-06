import { lazy, Suspense } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const UserCardsPage = lazy(() => import("./UserCardsPage"));

const index = ({ users }) => {

	return (
		<>
			<Head>
				<title>User: Cards</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<UserCardsPage users={users} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index