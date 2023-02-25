import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import PpeEditPage from "./PpeEditPage";

const index = ({ inventory }) => {
	return (
		<DashboardLayout>
			<PpeEditPage inventory={inventory} />
		</DashboardLayout>
	)
}

export default index