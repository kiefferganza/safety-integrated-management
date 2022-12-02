import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import EmployeeCreateEditPage from "../EmployeeCreateEditPage";

const index = ({ companies, departments, nationalities, positions, users }) => {
	return (
		<DashboardLayout>
			<EmployeeCreateEditPage
				currentEmployee={{}}
				companies={companies}
				departments={departments}
				nationalities={nationalities}
				positions={positions}
				users={users}
			/>
		</DashboardLayout>
	)
}

export default index