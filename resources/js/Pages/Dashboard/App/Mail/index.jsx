import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { MailView } from "@/sections/@dashboard/mail/view";
import { Head } from "@inertiajs/inertia-react";

const index = () => {
	return (
		<>
			<Head>
				<title>Mail</title>
			</Head>
			<DashboardLayout>
				<MailView />
			</DashboardLayout>
		</>
	)
}

export default index