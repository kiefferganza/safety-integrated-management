import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import EmployeeCreateEditPage from "../EmployeeCreateEditPage";

const index = ({ currentEmployee, companies, departments, positions }) => {
	return (
		<DashboardLayout>
			<EmployeeCreateEditPage
				currentEmployee={currentEmployee}
				companies={companies}
				departments={departments}
				positions={positions}
				isEdit={true}
			/>
		</DashboardLayout>
	)
}

export default index