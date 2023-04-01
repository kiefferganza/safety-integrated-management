import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { useEffect, useState, Suspense, lazy } from "react";
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
const FileManagerPage = lazy(() => import("./FileManagerPage"));

const index = ({ folders, externalTraining }) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const folderObj = folders.map((f) => {
			return {
				id: f.folder_id,
				revision_no: f.revision_no,
				name: f.folder_name,
				dateCreated: new Date(f.date_created),
				size: f.fileSize,
				totalFiles: f.fileCount,
				totalDocs: f.documents.length,
				url: '',
				type: 'folder'
			}
		});
		setData(folderObj);
	}, [folders]);

	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<FileManagerPage folders={data} externalTraining={externalTraining} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index