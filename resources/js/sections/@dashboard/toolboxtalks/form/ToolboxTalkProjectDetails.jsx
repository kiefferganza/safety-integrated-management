// @mui
import { Box, Stack, Divider, Typography } from '@mui/material';
import { RHFTextField } from '@/Components/hook-form';
// ----------------------------------------------------------------------

const ToolboxTalkProjectDetails = () => {
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h6" sx={{ color: 'text.disabled', flex: 1, mb: 3 }}>
				Project Detail
			</Typography>

			<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
				<Stack alignItems="flex-end" spacing={2}>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

						<RHFTextField
							name="project_code"
							label="Project Code"
							inputProps={{
								sx: { textTransform: "uppercase" }
							}}
						/>

						<RHFTextField name="originator" label="Originator" />

						<RHFTextField name="discipline" label="Discipline" />

					</Stack>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

						<RHFTextField name="document_type" label="Type" />

						<RHFTextField name="document_zone" label="Zone (Optional)" />

						<RHFTextField name="document_level" label="Level (Optional)" />

					</Stack>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

						<RHFTextField disabled name="sequence_no" label="Squence No." fullWidth />
						<Box width={1} />
						<Box width={1} />

					</Stack>
				</Stack>
			</Stack>

			<Divider sx={{ my: 3, borderStyle: 'dashed' }} />
		</Box>
	)
}

export default ToolboxTalkProjectDetails