import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserCardsPage from "./UserCardsPage";

const index = ({ auth }) => {
	return (
		<>
			<Head>
				<title>User: Cards</title>
			</Head>
			<DashboardLayout>
				<UserCardsPage />
			</DashboardLayout>
		</>
	)
}

export default index