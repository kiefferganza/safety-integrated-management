import { RHFAutocomplete, RHFTextField } from '@/Components/hook-form'
import { Divider, Stack, TextField } from '@mui/material'
import { useFormContext } from 'react-hook-form';


const IncidentInformation = ({ types }) => {
	const { setValue, watch, formState: { errors } } = useFormContext();
	const values = watch();

	return (
		<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
			<Stack spacing={3}>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<RHFAutocomplete
						name="incident"
						fullWidth
						onChange={(_event, newValue) => setValue('incident', newValue, { shouldValidate: true, shouldDirty: true })}
						options={types.incident.map((option) => option.name)}
						getOptionLabel={(option) => option}
						renderInput={(params) => <TextField label="Incident Classification" {...params} error={!!errors?.incident?.message} helperText={errors?.incident?.message} />}
					/>

					<RHFAutocomplete
						name="nature"
						fullWidth
						onChange={(_event, newValue) => setValue('nature', newValue, { shouldValidate: true, shouldDirty: true })}
						options={types.nature.map((option) => option.name)}
						getOptionLabel={(option) => option}
						renderInput={(params) => <TextField label="Nature of Injury" {...params} error={!!errors?.nature?.message} helperText={errors?.nature?.message} />}
					/>

					<RHFTextField
						name="lti"
						label="LTI of the Injured (Number of days loss)"
						value={values.lti === 0 ? "" : values.lti}
						onChange={(event) => {
							setValue('lti', Number(event.target.value), { shouldValidate: true, shouldDirty: true });
						}}
						InputLabelProps={{ shrink: true }}
						InputProps={{
							type: 'number',
						}}
					/>

				</Stack>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<RHFAutocomplete
						name="indicator"
						fullWidth
						onChange={(_event, newValue) => setValue('indicator', newValue, { shouldValidate: true, shouldDirty: true })}
						options={types.indicator.map((option) => option.name)}
						getOptionLabel={(option) => option}
						renderInput={(params) => <TextField label="Leading Indicator" {...params} error={!!errors?.indicator?.message} helperText={errors?.indicator?.message} />}
					/>

					<RHFAutocomplete
						name="root_cause"
						fullWidth
						onChange={(_event, newValue) => setValue('root_cause', newValue, { shouldValidate: true, shouldDirty: true })}
						options={types.root_cause.map((option) => option.name)}
						getOptionLabel={(option) => option}
						renderInput={(params) => <TextField label="Root Cause" {...params} error={!!errors?.root_cause?.message} helperText={errors?.root_cause?.message} />}
					/>

					<RHFAutocomplete
						name="mechanism"
						fullWidth
						onChange={(_event, newValue) => setValue('mechanism', newValue, { shouldValidate: true, shouldDirty: true })}
						options={types.mechanism.map((option) => option.name)}
						getOptionLabel={(option) => option}
						renderInput={(params) => <TextField label="Mechanism of Injury" {...params} error={!!errors?.mechanism?.message} helperText={errors?.mechanism?.message} />}
					/>

				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<RHFAutocomplete
						name="equipment"
						fullWidth
						multiple
						value={values.equipment?.trim() === "" ? [] : values.equipment?.trim()?.split(",")}
						isOptionEqualToValue={(option, value) => option === value}
						onChange={(_event, newValue) => setValue('equipment', newValue.join(","), { shouldValidate: true, shouldDirty: true })}
						options={types.equipment.map((option) => option.name)}
						getOptionLabel={(option) => option}
						renderInput={(params) => <TextField label="Equipment Involved" {...params} error={!!errors?.equipment?.message} helperText={errors?.equipment?.message} />}
					/>

					<RHFAutocomplete
						name="body_part"
						fullWidth
						multiple
						value={values.body_part?.trim() === "" ? [] : values.body_part?.trim()?.split(",")}
						isOptionEqualToValue={(option, value) => option === value}
						onChange={(_event, newValue) => setValue('body_part', newValue.join(","), { shouldValidate: true, shouldDirty: true })}
						options={types.body_part.map((option) => option.name)}
						getOptionLabel={(option) => option}
						renderInput={(params) => <TextField label="Body Part Injured" {...params} error={!!errors?.body_part?.message} helperText={errors?.body_part?.message} />}
					/>


					<RHFAutocomplete
						name="severity"
						fullWidth
						onChange={(_event, newValue) => setValue('severity', newValue, { shouldValidate: true, shouldDirty: true })}
						options={types.severity.map((option) => option.name)}
						getOptionLabel={(option) => option}
						renderInput={(params) => <TextField label="Potential Severity" {...params} error={!!errors?.severity?.message} helperText={errors?.severity?.message} />}
					/>
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<RHFTextField label="Remarks (Optional)" fullWidth multiline name="remarks" rows={3} />
				</Stack>
			</Stack>
		</Stack>
	)
}

export default IncidentInformation