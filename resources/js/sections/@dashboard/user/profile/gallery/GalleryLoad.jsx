// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Skeleton } from '@mui/material';
// utils
import { bgBlur } from '@/utils/cssStyles';
import getRatio from '@/Components/image/getRatio';;

const GalleryLoad = () => {
	const theme = useTheme();
	return (
		<Card sx={{ cursor: 'pointer', position: 'relative' }}>
			<Box
				component="span"
				sx={{
					width: 1,
					lineHeight: 1,
					display: 'block',
					overflow: 'hidden',
					position: 'relative',
					pt: getRatio('1/1')
				}}
			>
				<Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: "absolute", top: 0, left: 0 }} />
			</Box>
			<Stack
				spacing={2}
				direction="row"
				alignItems="center"
				sx={{
					...bgBlur({
						color: theme.palette.grey[900],
					}),
					width: 1,
					left: 0,
					bottom: 0,
					position: 'absolute',
					color: 'common.white',
					p: (theme) => theme.spacing(3, 1, 3, 3),
				}}
			>
			</Stack>
		</Card>
	)
}

export default GalleryLoad;