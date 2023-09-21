const { Box, TableCell, TableRow } = await import('@mui/material');
import Label from '@/Components/label/Label';

const DocumentComments = ({ row, index, reviewer, commentStatus }) => {
	return (
		<TableRow
			sx={{
				borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
			}}
		>
			<TableCell>{index + 1}</TableCell>

			<TableCell align="left">{reviewer?.fullname}</TableCell>

			<TableCell align="left">
				{row.pages.split(",").map(page => (
					<Box component="span" display="block" key={page}>{page}</Box>
				))}
			</TableCell>

			<TableCell align="center">{row.comment_code}</TableCell>

			<TableCell align="left" sx={{ wordBreak: "break-all", maxWidth: "140px" }}>{row.comment}</TableCell>

			<TableCell align="center">{row?.reply_code}</TableCell>

			<TableCell align="center">{row?.reply}</TableCell>

			<TableCell align="center">
				<Label color={commentStatus.color}>
					{commentStatus.text}
				</Label>
			</TableCell>
		</TableRow>
	)
}

export default DocumentComments