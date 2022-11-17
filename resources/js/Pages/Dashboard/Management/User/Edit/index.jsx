import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserEditPage from "./UserEditPage";

const index = () => {
	return (
		<>
			<Head>
				<title>User: Edit</title>
			</Head>
			<DashboardLayout>
				<UserEditPage />
			</DashboardLayout>
		</>
	)
}

export default index