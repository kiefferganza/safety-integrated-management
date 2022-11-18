import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import BlogPostsPage from "./BlogPostsPage";

const index = () => {
	return (
		<DashboardLayout>
			<BlogPostsPage />
		</DashboardLayout>
	)
}

export default index