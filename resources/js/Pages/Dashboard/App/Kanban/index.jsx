import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import KanbanPage from "./KanbanPage";

const index = () => {
	return (
		<>
			<Head>
				<title>Kanban</title>
			</Head>
			<DashboardLayout>
				<KanbanPage />
			</DashboardLayout>
		</>
	)
}

export default index