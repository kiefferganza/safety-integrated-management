import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserListPage from "./UserListPage";

const index = ({ users }) => {
	return (
		<>
			<Head>
				<title>User List</title>
			</Head>
			<DashboardLayout>
				<UserListPage users={users} />
			</DashboardLayout>
		</>
	)
}

export default index