import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import BlogPostPage from "./BlogPostPage";

const index = () => {
	return (
		<DashboardLayout>
			<BlogPostPage />
		</DashboardLayout>
	)
}

export default index