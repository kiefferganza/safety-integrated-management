import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { getInventoryStatus } from "@/utils/formatStatuses";
import PpeProductDetailsPage from "./PpeProductDetailsPage";

const index = ({ inventory }) => {
	inventory.status = getInventoryStatus(inventory?.current_stock_qty, inventory?.min_qty)
	return (
		<DashboardLayout>
			<PpeProductDetailsPage inventory={inventory} />
		</DashboardLayout>
	)
}

export default index