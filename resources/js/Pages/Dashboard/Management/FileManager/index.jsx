import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import FileManagerPage from "./FileManagerPage";

const index = () => {
	return (
		<DashboardLayout>
			<FileManagerPage />
		</DashboardLayout>
	)
}

export default index