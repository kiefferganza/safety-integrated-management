import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralBookingPage from "./GeneralBookingPage";

const index = () => {
	return (
		<>
			<Head>
				<title> General: Booking</title>
			</Head>
			<DashboardLayout>
				<GeneralBookingPage />
			</DashboardLayout>
		</>
	)
}

export default index