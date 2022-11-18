import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import CalendarPage from "./CalendarPage";

const index = () => {
	return (
		<>
			<Head>
				<title>Calendar</title>
			</Head>
			<DashboardLayout>
				<CalendarPage />
			</DashboardLayout>
		</>
	)
}

export default index