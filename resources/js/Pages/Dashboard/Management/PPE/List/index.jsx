import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import PPEListPage from "./PPEListPage";

const index = ({ inventory }) => {
	return (
		<DashboardLayout>
			<PPEListPage inventory={inventory} />
		</DashboardLayout>
	)
}

export default index