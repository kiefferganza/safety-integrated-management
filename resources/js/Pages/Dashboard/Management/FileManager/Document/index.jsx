import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import DocumentListPage from "./DocumentListPage";

const index = ({ folder, auth: { user } }) => {
	return (
		<DashboardLayout>
			<DocumentListPage folder={folder} user={user} />
		</DashboardLayout>
	)
}

export default index