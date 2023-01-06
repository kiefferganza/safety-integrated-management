// @mui
import { Box, Stack, Divider, Typography } from '@mui/material';
// components
import { RHFSelect, RHFTextField } from '@/Components/hook-form';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
	{ type: 2, label: 'Client' },
	{ type: 1, label: 'In-house' },
	{ type: 3, label: 'External' },
	{ type: 4, label: 'Induction' },
];

const TrainingProjectDetails = ({ isEdit, updateSequence }) => {
	const { setValue } = useFormContext();

	return (
		<Box sx={{ p: 3 }}>
			<Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" sx={{ mb: 3 }}>
				<Typography variant="h6" sx={{ color: 'text.disabled', flex: 1 }}>
					Project Detail
				</Typography>
				<RHFSelect
					disabled={isEdit}
					size="small"
					name="type"
					label="Course Type"
					sx={{ width: { xs: '100%', md: 140 } }}
					onChange={(e) => {
						setValue("type", e.target.value, { shoudValidate: true });
						updateSequence(e.target.value)
					}}
				>
					<option value=""></option>
					{TYPE_OPTIONS.map(option => (
						<option key={option.type} value={option.type} >
							{option.label}
						</option>
					))}
				</RHFSelect>
			</Stack>

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

export default TrainingProjectDetails