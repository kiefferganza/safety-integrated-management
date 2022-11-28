import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import EmployeeListPage from "./EmployeeListPage";

const index = ({ employees, can_write_employee }) => {



	return (
		<DashboardLayout>
			<EmployeeListPage employees={employees} canWrite={can_write_employee} />
		</DashboardLayout>
	)
}

export default index