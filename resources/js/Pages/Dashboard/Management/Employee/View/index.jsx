import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { getCurrentUserName } from "@/utils/formatName";
import { Head } from "@inertiajs/inertia-react";
import EmployeeProfilePage from "./EmployeeProfilePage";

const index = ({ employees, id }) => {
	const currentEmployee = employees.find(employee => id === employee.employee_id) || {};

	return (
		<>
			<Head>
				<title>{`${getCurrentUserName(currentEmployee)} Profile`}</title>
			</Head>
			<DashboardLayout>
				<EmployeeProfilePage employee={currentEmployee} employees={employees} />
			</DashboardLayout>
		</>
	)
}

export default index