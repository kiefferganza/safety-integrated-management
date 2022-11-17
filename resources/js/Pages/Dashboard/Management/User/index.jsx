import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserProfilePage from "./UserProfilePage";

const index = ({ auth }) => {
	return (
		<>
			<Head>
				<title>User: Profile</title>
			</Head>
			<DashboardLayout>
				<UserProfilePage user={auth?.user || {}} />
			</DashboardLayout>
		</>
	)
}

export default index