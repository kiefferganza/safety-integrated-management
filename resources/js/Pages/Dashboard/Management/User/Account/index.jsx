import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserAccountPage from "./UserAccountPage";

const index = ({ auth }) => {

	return (
		<>
			<Head>
				<title>Setting</title>
			</Head>
			<DashboardLayout>
				<UserAccountPage user={auth?.user || {}} />
			</DashboardLayout>
		</>
	)
}

export default index