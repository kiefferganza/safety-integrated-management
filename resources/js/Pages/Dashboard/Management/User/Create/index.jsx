import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserCreatePage from "./UserCreatePage";

const index = ({ employees }) => {
	return (
		<>
			<Head>
				<title>User: Create</title>
			</Head>
			<DashboardLayout>
				<UserCreatePage employees={employees} />
			</DashboardLayout>
		</>
	)
}

export default index