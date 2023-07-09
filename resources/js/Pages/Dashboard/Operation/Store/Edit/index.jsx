import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const StoreEditPage = lazy(() => import("./StoreEditPage"));

const index = ({ store }) => {
	return (
		<>
			<Head>
				<title>Edit Product</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<StoreEditPage store={store} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index