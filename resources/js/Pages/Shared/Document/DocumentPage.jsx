// utils
import { getDocumentStatus, getDocumentReviewStatus } from '@/utils/formatStatuses';
// MUI
const { Card } = await import('@mui/material');
// sections
import DocumentDetailBody from '@/sections/shared/document/detail/DocumentDetailBody';
import DocumentDetailHeader from '@/sections/shared/document/detail/DocumentDetailHeader';
import DocumentDetailToolbar from '@/sections/shared/document/detail/DocumentDetailToolbar';

const DocumentPage = ({ document, positions, customUser }) => {
	const {
		currentFile,
		form_number
	} = document;

	const latestUploadedFile = currentFile;

	const docStatus = getDocumentStatus(customUser.status);
	return (
		<>
			<DocumentDetailToolbar cms={form_number} document={document} latestUploadedFile={latestUploadedFile} positions={positions} status={customUser.status} />
			<Card sx={{ p: 3 }}>
				<DocumentDetailHeader
					title="Document Review Sheet"
					cms={form_number}
					document={document}
					latestUploadedFile={latestUploadedFile}
				/>
				<DocumentDetailBody document={document} positions={positions} customUser={customUser} />
			</Card >
		</>
	)
}

export default DocumentPage
