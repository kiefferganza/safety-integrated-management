import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import TBTStatisticPage from "./TBTStatisticPage";

const index = ({ statistics }) => {
	return (
		<>
			<Head>
				<title>Statistic - Toolbox Talks</title>
			</Head>
			<DashboardLayout>
				<TBTStatisticPage statistics={statistics} />
			</DashboardLayout>
		</>
	)
}

export default index