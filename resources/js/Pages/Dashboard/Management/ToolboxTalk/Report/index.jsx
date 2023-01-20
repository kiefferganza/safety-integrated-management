import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
import TBTReportPage from "./TBTReportPage";

const index = ({ positions }) => {
	return (
		<>
			<Head>
				<title>Toolbox Talks: Report</title>
			</Head>
			<DashboardLayout>
				<TBTReportPage positions={positions} />
			</DashboardLayout>
		</>
	)
}

export default index