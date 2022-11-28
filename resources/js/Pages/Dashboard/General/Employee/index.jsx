import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralEmployeePage from "./GeneralEmployeePage";

const index = ({ auth }) => {
	return (
		<>
			<Head>
				<title>General: Employee</title>
			</Head>
			<DashboardLayout>
				<GeneralEmployeePage user={auth?.user || {}} />
			</DashboardLayout>
		</>
	)
}

export default index