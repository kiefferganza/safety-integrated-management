import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserEditPage from "./UserEditPage";

const index = ({ user }) => {
	return (
		<>
			<Head>
				<title>User: Edit</title>
			</Head>
			<DashboardLayout>
				<UserEditPage user={user} />
			</DashboardLayout>
		</>
	)
}

export default index