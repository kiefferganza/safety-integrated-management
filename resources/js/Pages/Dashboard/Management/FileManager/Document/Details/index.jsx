import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import Findings from '@/sections/@dashboard/inspection/details/Findings';
import { Container } from '@mui/material';
import { Head } from '@inertiajs/inertia-react';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { formatCms } from '@/utils/tablesUtils';

const index = ({ folder, document }) => {
	const { themeStretch } = useSettingsContext();

	const cms = formatCms(document).toUpperCase();

	return (
		<DashboardLayout>
			<Head>
				<title>{`${folder.folder_name} - ${cms}: Detail`}</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading={cms}
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
							name: cms,
						},
					]}
				/>
			</Container>
		</DashboardLayout>
	)
}

export default index