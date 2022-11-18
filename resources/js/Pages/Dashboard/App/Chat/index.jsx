import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Chat } from "@/sections/@dashboard/chat";
import { Head } from "@inertiajs/inertia-react";

const index = () => {
	return (
		<>
			<Head>
				<title>Chat</title>
			</Head>
			<DashboardLayout>
				<Chat />
			</DashboardLayout>
		</>
	)
}

export default index