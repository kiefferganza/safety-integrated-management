import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import { Head } from '@inertiajs/inertia-react';
import { formatCms } from '@/utils/tablesUtils';
// MUI
const { Box, Card, Container, Stack, Typography } = await import('@mui/material');
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import DocumentDetailHeader from '@/sections/@dashboard/document/detail/DocumentDetailHeader';

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
				<Card sx={{ p: 3 }}>
					<DocumentDetailHeader
						title="Document Review Sheet"
						cms={cms}
						rev={document?.rev}
					/>
				</Card >
			</Container>
		</DashboardLayout>
	)
}

export default index