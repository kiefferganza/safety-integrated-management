import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserListPage from "./UserListPage";

const index = () => {
	return (
		<>
			<Head>
				<title>User: List</title>
			</Head>
			<DashboardLayout>
				<UserListPage />
			</DashboardLayout>
		</>
	)
}

export default index