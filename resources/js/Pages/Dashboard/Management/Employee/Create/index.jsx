import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import EmployeeCreateEditPage from "../EmployeeCreateEditPage";

const index = ({ companies, departments, positions, users }) => {
	return (
		<DashboardLayout>
			<EmployeeCreateEditPage
				currentEmployee={null}
				companies={companies}
				departments={departments}
				positions={positions}
				users={users}
			/>
		</DashboardLayout>
	)
}

export default index