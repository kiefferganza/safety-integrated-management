import { Suspense, lazy } from "react";
import { Head } from '@inertiajs/inertia-react';
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const PpeCreatePage = lazy(() => import("./PpeCreatePage"));

const index = () => {
	return (
		<>
			<Head>
				<title>Create a new product</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<PpeCreatePage />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index