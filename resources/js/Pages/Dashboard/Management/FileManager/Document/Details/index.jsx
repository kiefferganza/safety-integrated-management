import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import { Head } from '@inertiajs/inertia-react';
// utils
import { formatCms } from '@/utils/tablesUtils';
import { getDocumentStatus, getDocumentReviewStatus } from '@/utils/formatStatuses';
// MUI
const { Card, Container } = await import('@mui/material');
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import DocumentDetailHeader from '@/sections/@dashboard/document/detail/DocumentDetailHeader';
import DocumentDetailToolbar from '@/sections/@dashboard/document/detail/DocumentDetailToolbar';
import DocumentDetailBody from '@/sections/@dashboard/document/detail/DocumentDetailBody';


const index = ({ folder, document, positions, auth: { user } }) => {
	const {
		status,
		employee,
		files,
		approval_employee,
		approval_sign,
		reviewer_employees,
		reviewer_sign
	} = document;
	const { themeStretch } = useSettingsContext();

	const cms = formatCms(document).toUpperCase();

	const latestUploadedFile = files[0];

	const docType = getDocumentType({ employee, reviewer_employees, approval_employee, userEmpId: user.emp_id });
	const docStatus = getStatus({ status, reviewer_sign, reviewer_employees, approval_sign });

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
				<DocumentDetailToolbar cms={cms} document={document} latestUploadedFile={latestUploadedFile} positions={positions} docStatus={docStatus} />
				<Card sx={{ p: 3 }}>
					<DocumentDetailHeader
						title="Document Review Sheet"
						cms={cms}
						document={document}
						user={user}
						latestUploadedFile={latestUploadedFile}
					/>
					<DocumentDetailBody document={document} docType={docType} user={user} positions={positions} />
				</Card >
			</Container>
		</DashboardLayout>
	)
}

function getDocumentType ({ employee, reviewer_employees, approval_employee, userEmpId }) {
	if (employee.employee_id === userEmpId) return "submitted";
	const isReview = reviewer_employees.findIndex(revEmp => revEmp.employee_id === userEmpId);
	const isApprove = approval_employee?.employee_id === userEmpId;
	if (isReview !== -1 && isApprove) return ["review", "approve"];
	if (isApprove) return "approve";
	if (isReview !== -1) return "review";
	return "documentControl";
}

function getStatus ({ status, reviewer_sign, reviewer_employees, approval_sign }) {
	if (approval_sign) {
		return getDocumentReviewStatus(status);
	}
	const isForApproval = reviewer_sign.length >= reviewer_employees.length;
	if (isForApproval) {
		return {
			statusText: "FOR APPROVAL",
			statusClass: "info",
		};
	} else {
		const isInReview = reviewer_employees.some(rev => rev.pivot.review_status !== "0");
		if (status === "0" && isInReview) {
			return {
				statusText: "REVIEWED",
				statusClass: "primary",
			};
		} else {
			return getDocumentStatus(status);
		}
	}
}

export default index