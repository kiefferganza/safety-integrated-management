import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import EmployeeCreateEditPage from "../EmployeeCreateEditPage";

const index = ({ currentEmployee, companies, departments, nationalities, positions }) => {
	return (
		<DashboardLayout>
			<EmployeeCreateEditPage
				currentEmployee={currentEmployee}
				companies={companies}
				departments={departments}
				nationalities={nationalities}
				positions={positions}
				isEdit={true}
			/>
		</DashboardLayout>
	)
}

export default index