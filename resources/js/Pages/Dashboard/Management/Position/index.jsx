import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import PositionListPage from "./PositionListPage";

const index = ({ positions }) => {

	return (
		<>
			<Head>
				<title>Positions</title>
			</Head>
			<DashboardLayout>
				<PositionListPage positions={positions} />
			</DashboardLayout>
		</>
	)
}

export default index