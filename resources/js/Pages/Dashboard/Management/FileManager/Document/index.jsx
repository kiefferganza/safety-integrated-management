import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const { DocumentListPage } = await import("./DocumentListPage");

const index = ({ folder, auth: { user } }) => {
	return (
		<DashboardLayout>
			<DocumentListPage folder={folder} user={user} />
		</DashboardLayout>
	)
}

export default index