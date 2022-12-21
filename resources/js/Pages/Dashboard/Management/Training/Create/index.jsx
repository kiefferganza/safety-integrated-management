import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import TrainingEditCreatePage from "../TrainingEditCreatePage";

const index = ({ type }) => {
	return (
		<DashboardLayout>
			<TrainingEditCreatePage type={type} />
		</DashboardLayout>
	)
}

export default index