import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// @mui
import { styled, alpha } from '@mui/material/styles';
//
import Iconify from '../iconify';
//
import RejectionFiles from './errors/RejectionFiles';
import CoverPreview from './preview/CoverPreview';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

const StyledDropZone = styled('div')(({ theme }) => ({
	margin: 'auto',
	display: 'flex',
	cursor: 'pointer',
	overflow: 'hidden',
	width: '100%',
	height: '100%',
	alignItems: 'center',
	position: 'relative',
	justifyContent: 'center',
}));

const StyledPlaceholder = styled('div')(({ theme }) => ({
	zIndex: 7,
	display: 'flex',
	position: 'absolute',
	alignItems: 'center',
	flexDirection: 'column',
	justifyContent: 'center',
	width: `100%`,
	height: `100%`,
	color: theme.palette.text.disabled,
	backgroundColor: theme.palette.background.neutral,
	transition: theme.transitions.create('opacity', {
		easing: theme.transitions.easing.easeInOut,
		duration: theme.transitions.duration.shorter,
	}),
}));

// ----------------------------------------------------------------------

UploadCover.propTypes = {
	sx: PropTypes.object,
	error: PropTypes.bool,
	disabled: PropTypes.bool,
	helperText: PropTypes.node,
	file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default function UploadCover ({ error, file, disabled, helperText, sx, ...other }) {
	const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
		multiple: false,
		disabled,
		accept: 'image/*',
		...other,
	});

	const hasFile = !!file;

	const isError = isDragReject || !!error;

	return (
		<>
			<StyledDropZone
				{...getRootProps()}
				sx={{
					...(isDragActive && {
						opacity: 0.72,
					}),
					...(isError && {
						borderColor: 'error.light',
						...(hasFile && {
							bgcolor: 'error.lighter',
						}),
					}),
					...(disabled && {
						opacity: 0.48,
						pointerEvents: 'none',
					}),
					...(hasFile && {
						'&:hover': {
							'& .placeholder': {
								opacity: 1,
							},
						},
					}),
					...sx,
				}}
			>
				<input {...getInputProps()} />

				{hasFile && <CoverPreview file={file} />}

				<StyledPlaceholder
					className="placeholder"
					sx={{
						'&:hover': {
							opacity: 0.61,
						},
						...(hasFile && {
							zIndex: 9,
							opacity: 0,
							color: 'common.white',
							bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
						}),
						...(isError && {
							color: 'error.main',
							bgcolor: 'error.lighter',
						}),
					}}
				>
					<Iconify icon="ic:round-add-a-photo" width={24} sx={{ mb: 1 }} />
					<Typography variant="caption">Change Cover</Typography>
				</StyledPlaceholder>
			</StyledDropZone>

			{helperText && helperText}

			<RejectionFiles fileRejections={fileRejections} />
		</>
	);
}
