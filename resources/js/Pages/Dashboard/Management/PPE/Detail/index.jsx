import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { getInventoryStatus } from "@/utils/formatStatuses";
const PpeProductDetailsPage = lazy(() => import("./PpeProductDetailsPage"));

const index = ({ inventory }) => {
	inventory.status = getInventoryStatus(inventory?.current_stock_qty, inventory?.min_qty)
	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<PpeProductDetailsPage inventory={inventory} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index