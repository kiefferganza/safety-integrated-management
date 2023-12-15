import { fileFormat, fileThumb } from '@/Components/file-thumbnail';
import { excerpt } from '@/utils/exercpt';
import { Stack, Link as MuiLink, Avatar, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

FileLinkThumbnail.propTypes = {
	file: PropTypes.object,
};

export default function FileLinkThumbnail({ file }) {
  return (
		<MuiLink
			component="a"
			href={file.url}
			sx={{
				color: "text.primary"
			}}
			target="_file"
			rel="noopener noreferrer"
		>
			<Stack
				spacing={2}
				direction="row"
				alignItems="center"
			>
				<Avatar variant="rounded" sx={{ bgcolor: 'background.neutral', width: 36, height: 36, borderRadius: "9px" }}>
					<Box component="img" src={fileThumb(fileFormat(file.url))} sx={{ width: 24, height: 24 }} />
				</Avatar>

				<Stack spacing={0.5} flexGrow={1}>
					<Typography variant="subtitle2" sx={{ textDecoration: "none" }}>{excerpt(file.name, 24)}</Typography>
				</Stack>
			</Stack>
		</MuiLink>
	)
}