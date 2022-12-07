import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserProfilePage from "./UserProfilePage";

const index = ({ auth, employee }) => {

	return (
		<>
			<Head>
				<title>Profile</title>
			</Head>
			<DashboardLayout>
				<UserProfilePage user={auth?.user || {}} employee={employee} />
			</DashboardLayout>
		</>
	)
}

export default index