import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserCreatePage from "./UserCreatePage";

const index = () => {
	return (
		<>
			<Head>
				<title>User: Create</title>
			</Head>
			<DashboardLayout>
				<UserCreatePage />
			</DashboardLayout>
		</>
	)
}

export default index