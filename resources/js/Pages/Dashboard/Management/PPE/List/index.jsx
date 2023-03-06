import { Suspense, lazy } from "react";
import { Head } from '@inertiajs/inertia-react';
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const PPEListPage = lazy(() => import("./PPEListPage"));

const index = ({ inventory }) => {
	return (
		<>
			<Head>
				<title> PPE: Product List</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<PPEListPage inventory={inventory} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index