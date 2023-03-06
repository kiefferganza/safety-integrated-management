import { Suspense, lazy } from 'react';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import capitalize from 'lodash/capitalize';
import { useSettingsContext } from '@/Components/settings';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Head } from "@inertiajs/inertia-react";
const Container = lazy(() => import("@mui/material/Container"));
const DocumentNewForm = lazy(() => import('@/sections/@dashboard/document/form/DocumentNewForm'));

const index = ({ folder }) => {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>Document Form</title>
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
									name: capitalize(folder.folder_name),
									href: PATH_DASHBOARD.fileManager.view(folder.folder_id),
								},
								{
									name: "New Document",
								},
							]}
						/>
						<DocumentNewForm />
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index