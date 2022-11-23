import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import UserCardsPage from "./UserCardsPage";

const index = ({ users }) => {

	return (
		<>
			<Head>
				<title>User: Cards</title>
			</Head>
			<DashboardLayout>
				<UserCardsPage users={users} />
			</DashboardLayout>
		</>
	)
}

export default index