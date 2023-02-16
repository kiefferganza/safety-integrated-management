import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import { Head } from '@inertiajs/inertia-react';
import { formatCms } from '@/utils/tablesUtils';
import { fTimestamp } from '@/utils/formatTime';
// MUI
const { Card, Container } = await import('@mui/material');
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import DocumentDetailHeader from '@/sections/@dashboard/document/detail/DocumentDetailHeader';
import DocumentDetailToolbar from '@/sections/@dashboard/document/detail/DocumentDetailToolbar';


const index = ({ folder, document, positions, auth: { user } }) => {
	const { reviewer_sign, files } = document
	const { themeStretch } = useSettingsContext();

	const cms = formatCms(document).toUpperCase();

	const latestUploadedFile = [...reviewer_sign, ...files].sort((a, b) => fTimestamp(b.upload_date) - fTimestamp(a.upload_date))[0];

	console.log(document)

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
				<DocumentDetailToolbar cms={cms} document={document} latestUploadedFile={latestUploadedFile} positions={positions} />
				<Card sx={{ p: 3 }}>
					<DocumentDetailHeader
						title="Document Review Sheet"
						cms={cms}
						document={document}
						user={user}
						latestUploadedFile={latestUploadedFile}
					/>
				</Card >
			</Container>
		</DashboardLayout>
	)
}

export default index