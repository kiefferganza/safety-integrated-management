import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserAccountPage from "./UserAccountPage";

const index = () => {
	return (
		<>
			<Head>
				<title>User: Account</title>
			</Head>
			<DashboardLayout>
				<UserAccountPage />
			</DashboardLayout>
		</>
	)
}

export default index