import { lazy, Suspense } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const DocumentListPage = lazy(() => import("./DocumentListPage"));

const index = ({ folder, auth: { user } }) => {

	return (
		<>
			<Head>
				<title>{`${folder.folder_name}: List`}</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<DocumentListPage folder={folder} user={user} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index