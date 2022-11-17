import GeneralAppPage from "./GeneralAppPage";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";

const index = ({ auth }) => {
	return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>
			<DashboardLayout>
				<GeneralAppPage auth={auth} />
			</DashboardLayout>
		</>
	)
}

export default index