import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { getCurrentUserName } from "@/utils/formatName";
import { Head } from "@inertiajs/inertia-react";
import EmployeeProfilePage from "./EmployeeProfilePage";

const index = ({ employee }) => {

	return (
		<>
			<Head>
				<title>{`${getCurrentUserName(employee)} Profile`}</title>
			</Head>
			<DashboardLayout>
				<EmployeeProfilePage employee={employee} />
			</DashboardLayout>
		</>
	)
}

export default index