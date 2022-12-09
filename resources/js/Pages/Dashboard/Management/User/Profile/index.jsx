import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { getCurrentUserName } from "@/utils/formatName";
import { Head } from "@inertiajs/inertia-react";
import UserProfilePage from "./UserProfilePage";

const index = ({ user }) => {
	return (
		<>
			<Head>
				<title>{getCurrentUserName(user)}</title>
			</Head>
			<DashboardLayout>
				<UserProfilePage user={user} />
			</DashboardLayout>
		</>
	)
}

export default index