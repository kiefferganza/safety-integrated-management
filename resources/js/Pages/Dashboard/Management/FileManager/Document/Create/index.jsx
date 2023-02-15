import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { PATH_DASHBOARD } from "@/routes/paths";
import DocumentNewForm from '@/sections/@dashboard/document/form/DocumentNewForm';
import { Head } from "@inertiajs/inertia-react";
import { Container } from "@mui/material";
import { capitalize } from 'lodash';

const index = ({ folder }) => {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>Document Form</title>
			</Head>
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
		</>
	)
}

export default index