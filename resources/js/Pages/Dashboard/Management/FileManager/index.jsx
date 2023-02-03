import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import FileManagerPage from "./FileManagerPage";

const index = ({ folders }) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const folderObj = folders.map((f) => {
			return {
				id: f.folder_id,
				name: f.folder_name,
				dateCreated: new Date(f.date_created),
				size: f.fileSize,
				totalFiles: f.fileCount,
				totalDocs: f.documents_count,
				url: '',
				type: 'folder'
			}
		});
		setData(folderObj);
	}, [folders]);

	return (
		<DashboardLayout>
			<FileManagerPage folders={data} />
		</DashboardLayout>
	)
}

export default index