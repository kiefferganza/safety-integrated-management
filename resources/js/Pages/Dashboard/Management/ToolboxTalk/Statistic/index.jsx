import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import TBTStatisticPage from "./TBTStatisticPage";

const index = () => {
	return (
		<>
			<Head>
				<title>Statistic - Toolbox Talks</title>
			</Head>
			<DashboardLayout>
				<TBTStatisticPage />
			</DashboardLayout>
		</>
	)
}

export default index