import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { useEffect, useState, Suspense, lazy } from "react";
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
const FileManagerPage = lazy(() => import("./FileManagerPage"));

const index = ({ folders, externalTraining }) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const mutatedFolders = folders.map((f) => {
			return {
				item_order: f.item_order,
				id: f.folder_id,
				revision_no: f.revision_no,
				name: f.folder_name,
				dateCreated: new Date(f.date_created),
				size: f.fileSize,
				totalFiles: f.fileCount,
				totalDocs: f.documents.length,
				url: '',
				type: 'folder',
				fileType: 'document'
			}
		});
		mutatedFolders.push({
			id: externalTraining.id,
			revision_no: null,
			name: "Third Party",
			type: "folder",
			fileType: "external",
			dateCreated: null,
			totalFiles: externalTraining.files,
			totalDocs: externalTraining.count,
			size: externalTraining.size,
			url: route("files.management.external"),
			item_order: 999,
			disableDrag: true
		});
		setData(mutatedFolders);
	}, [folders]);
	console.log({ folders, data })

	return (
		<Suspense fallback={<LoadingScreen />}>
			<DashboardLayout>
				<FileManagerPage folders={data} />
			</DashboardLayout>
		</Suspense>
	)
}

export default index