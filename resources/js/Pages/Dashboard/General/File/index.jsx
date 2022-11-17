import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralFilePage from "./GeneralFilePage";

const index = () => {
	return (
		<>
			<Head>
				<title> General: File</title>
			</Head>
			<DashboardLayout>
				<GeneralFilePage />
			</DashboardLayout>
		</>
	)
}

export default index