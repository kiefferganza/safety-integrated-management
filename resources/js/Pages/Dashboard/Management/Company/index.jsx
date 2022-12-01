import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import CompanyListPage from "./CompanyListPage";

const index = ({ companies }) => {

	return (
		<>
			<Head>
				<title>Companies</title>
			</Head>
			<DashboardLayout>
				<CompanyListPage companies={companies} />
			</DashboardLayout>
		</>
	)
}

export default index