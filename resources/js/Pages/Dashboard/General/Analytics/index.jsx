import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralAnalyticsPage from "./GeneralAnalyticsPage";

const index = ({ auth: { user } }) => {
	return (
		<>
			<Head>
				<title> General: Analytics</title>
			</Head>
			<DashboardLayout>
				<GeneralAnalyticsPage user={user} />
			</DashboardLayout>
		</>
	)
}

export default index