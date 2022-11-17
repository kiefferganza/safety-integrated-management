import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Mail } from "@/sections/@dashboard/mail";
import { Head } from "@inertiajs/inertia-react";

const index = () => {
	return (
		<>
			<Head>
				<title>Mail</title>
			</Head>
			<DashboardLayout>
				<Mail />
			</DashboardLayout>
		</>
	)
}

export default index