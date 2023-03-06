import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const PpeEditPage = lazy(() => import("./PpeEditPage"));

const index = ({ inventory }) => {
	return (
		<>
			<Head>
				<title>Edit Product</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<PpeEditPage inventory={inventory} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index