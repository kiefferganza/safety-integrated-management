import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralBankingPage from "./GeneralBankingPage";

const index = () => {
	return (
		<>
			<Head>
				<title> General: Banking</title>
			</Head>
			<DashboardLayout>
				<GeneralBankingPage />
			</DashboardLayout>
		</>
	)
}

export default index