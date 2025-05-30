import { Suspense, lazy } from 'react';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { useSettingsContext } from '@/Components/settings';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Head } from "@inertiajs/inertia-react";
const Container = lazy(() => import("@mui/material/Container"));
const DocumentNewEditForm = lazy(() => import('@/sections/@dashboard/document/form/DocumentNewEditForm'));

const index = ({ folder, document, projectDetails }) => {
	const { themeStretch } = useSettingsContext();
	return (
		<>
			<Head>
				<title>Edit Document</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<Container maxWidth={themeStretch ? false : 'lg'}>
						<CustomBreadcrumbs
							heading={"Document Form"}
							links={[
								{
									name: 'File Manager',
									href: PATH_DASHBOARD.fileManager.root,
								},
								{
									name: folder.folder_name,
									href: PATH_DASHBOARD.fileManager.view(folder.folder_id),
								},
								{
									name: "Edit Document",
								},
							]}
						/>
						<DocumentNewEditForm currentDocument={document} isEdit projectDetails={projectDetails} />
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index