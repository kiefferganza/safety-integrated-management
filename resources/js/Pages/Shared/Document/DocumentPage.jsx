// utils
import { getDocumentReviewStatus } from '@/utils/formatStatuses';
// MUI
const { Card } = await import('@mui/material');
// sections
import DocumentDetailBody from '@/sections/shared/document/detail/DocumentDetailBody';
import DocumentDetailHeader from '@/sections/shared/document/detail/DocumentDetailHeader';
import DocumentDetailToolbar from '@/sections/shared/document/detail/DocumentDetailToolbar';

const DocumentPage = ({ document, positions, customUser, sharedLink, rolloutDate }) => {
	const {
		currentFile,
		form_number
	} = document;

	const latestUploadedFile = currentFile;

	const appStatus = getDocumentReviewStatus(customUser.status);
	return (
		<>
			<DocumentDetailToolbar cms={form_number} document={document} latestUploadedFile={latestUploadedFile} positions={positions} status={customUser.status} rolloutDate={rolloutDate} />
			<Card sx={{ p: 3 }}>
				<DocumentDetailHeader
					title="Document Review Sheet"
					cms={form_number}
					document={document}
					latestUploadedFile={latestUploadedFile}
					rolloutDate={rolloutDate}
				/>
				<DocumentDetailBody document={document} positions={positions} customUser={customUser} sharedLink={sharedLink} appStatus={appStatus} />
			</Card >
		</>
	)
}

export default DocumentPage
