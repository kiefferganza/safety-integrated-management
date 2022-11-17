import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralAnalyticsPage from "./GeneralAnalyticsPage";

const index = () => {
	return (
		<>
			<Head>
				<title> General: Analytics</title>
			</Head>
			<DashboardLayout>
				<GeneralAnalyticsPage />
			</DashboardLayout>
		</>
	)
}

export default index