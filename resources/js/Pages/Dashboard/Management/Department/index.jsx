import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import DepartmentListPage from "./DepartmentListPage";

const index = ({ departments }) => {
	return (
		<>
			<Head>
				<title>Departments</title>
			</Head>
			<DashboardLayout>
				<DepartmentListPage departments={departments} />
			</DashboardLayout>
		</>
	)
}

export default index