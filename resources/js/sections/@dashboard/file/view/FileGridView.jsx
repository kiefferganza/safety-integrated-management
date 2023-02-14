import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
// @mui
import {
	Collapse,
	Box,
	// Divider,
	// Button
} from '@mui/material';
// components
// import Iconify from '@/Components/iconify';
//
import FilePanel from '../FilePanel';
// import FileCard from '../item/FileCard';
import FileFolderCard from '../item/FileFolderCard';
import FileNewFolderDialog from '../portal/FileNewFolderDialog';

// ----------------------------------------------------------------------

FileGridView.propTypes = {
	data: PropTypes.array,
	table: PropTypes.object,
	onDeleteItem: PropTypes.func,
	dataFiltered: PropTypes.array,
	onOpenConfirm: PropTypes.func,
};

export default function FileGridView ({ table, data, dataFiltered, onDeleteItem }) {
	// const { selected, onSelectRow: onSelectItem } = table;

	const containerRef = useRef(null);

	const [folderName, setFolderName] = useState('');

	// const [collapseFiles, setCollapseFiles] = useState(false);

	const [openNewFolder, setOpenNewFolder] = useState(false);

	const [openUploadFile, setOpenUploadFile] = useState(false);

	const [collapseFolders, setCollapseFolders] = useState(false);

	const handleOpenNewFolder = () => {
		setOpenNewFolder(true);
	};

	const handleCloseNewFolder = () => {
		setOpenNewFolder(false);
	};

	// const handleOpenUploadFile = () => {
	// 	setOpenUploadFile(true);
	// };

	const handleCloseUploadFile = () => {
		setOpenUploadFile(false);
	};


	return (
		<>
			<Box ref={containerRef}>
				<FilePanel
					title="Folders"
					subTitle={`${data.filter((item) => item.type === 'folder').length} folders`}
					onOpen={handleOpenNewFolder}
					collapse={collapseFolders}
					onCollapse={() => setCollapseFolders(!collapseFolders)}
				/>

				<Collapse in={!collapseFolders} unmountOnExit>
					<Box
						gap={3}
						display="grid"
						gridTemplateColumns={{
							xs: 'repeat(1, 1fr)',
							sm: 'repeat(2, 1fr)',
							md: 'repeat(3, 1fr)',
							lg: 'repeat(4, 1fr)',
						}}
					>
						{dataFiltered
							.filter((i) => i.type === 'folder')
							.map((folder) => (
								<FileFolderCard
									key={folder.id}
									folder={folder}
									onDelete={() => onDeleteItem(folder.id)}
									sx={{ maxWidth: 'auto' }}
								/>
							))}
					</Box>
				</Collapse>

				{/* <Divider sx={{ my: 5, borderStyle: 'dashed' }} />

				<FilePanel
					title="Files"
					subTitle={`${data.filter((item) => item.type !== 'folder').length} files`}
					onOpen={handleOpenUploadFile}
					collapse={collapseFiles}
					onCollapse={() => setCollapseFiles(!collapseFiles)}
				/>

				<Collapse in={!collapseFiles} unmountOnExit>
					<Box
						display="grid"
						gridTemplateColumns={{
							xs: 'repeat(1, 1fr)',
							sm: 'repeat(2, 1fr)',
							md: 'repeat(3, 1fr)',
							lg: 'repeat(4, 1fr)',
						}}
						gap={3}
					>
						{dataFiltered
							.filter((i) => i.type !== 'folder')
							.map((file) => (
								<FileCard
									key={file.id}
									file={file}
									selected={selected.includes(file.id)}
									onSelect={() => onSelectItem(file.id)}
									onDelete={() => onDeleteItem(file.id)}
									sx={{ maxWidth: 'auto' }}
								/>
							))}
					</Box>
				</Collapse> */}
			</Box>

			<FileNewFolderDialog open={openUploadFile} onClose={handleCloseUploadFile} />

			<FileNewFolderDialog
				open={openNewFolder}
				onClose={handleCloseNewFolder}
				title="New Folder"
				onCreate={() => {
					handleCloseNewFolder();
					setFolderName('');
					console.log('CREATE NEW FOLDER', folderName);
				}}
				folderName={folderName}
				onChangeFolderName={(event) => setFolderName(event.target.value)}
			/>
		</>
	);
}
