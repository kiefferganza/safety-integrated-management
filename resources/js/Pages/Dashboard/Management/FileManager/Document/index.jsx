import { lazy, Suspense } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { capitalCase } from "change-case";
import { Head } from "@inertiajs/inertia-react";
const DocumentListPage = lazy(() => import("./DocumentListPage"));

const index = ({ folder, auth: { user } }) => {

	const folderName = capitalCase(folder.folder_name);
	return (
		<>
			<Head>
				<title>{`${folderName}: List`}</title>
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