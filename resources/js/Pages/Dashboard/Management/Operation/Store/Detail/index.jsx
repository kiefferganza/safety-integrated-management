import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { getInventoryStatus } from "@/utils/formatStatuses";
const StoreDetailPage = lazy(() => import("./StoreDetailPage"));

const index = ({ store }) => {
	store.status = getInventoryStatus(store?.qty, store?.min_qty)
	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<StoreDetailPage store={store} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index