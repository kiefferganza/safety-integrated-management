import { Suspense, lazy } from "react";
import { Head } from '@inertiajs/inertia-react';
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const StoreCreatePage = lazy(() => import("./StoreCreatePage"));

const index = () => {

	return (
		<>
			<Head>
				<title>Create a new product</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<StoreCreatePage />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index