import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import EmployeeCreatePage from "./EmployeeCreatePage";

const index = () => {
	return (
		<DashboardLayout>
			<EmployeeCreatePage />
		</DashboardLayout>
	)
}

export default index