import { RHFTextField } from '@/Components/hook-form'
import { Autocomplete, Box, Divider, Stack, TextField, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form';


const GeneralIncident = ({ personel }) => {
	const { setValue, watch, formState: { errors } } = useFormContext();
	const values = watch();

	const getAutocompleteValue = (id) => {
		const findPerson = personel.find(per => per.employee_id == id);
		if (findPerson) {
			return `${findPerson.firstname} ${findPerson.lastname}`
		}
		return null;
	}


	const options = personel.map((option) => ({ id: option.employee_id, label: `${option?.firstname} ${option?.lastname}`, user_id: option.user_id }));

	return (
		<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
			<Stack spacing={3}>
				<Typography variant="h6" sx={{ color: 'text.disabled' }}>
					Project Detail
				</Typography>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<RHFTextField
						name="project_code"
						label="Project Code"
						onChange={(event) => {
							setValue("project_code", event.target.value, { shouldValidate: true });
						}}
						inputProps={{
							sx: { textTransform: "uppercase" }
						}}
					/>

					<RHFTextField
						name="originator"
						onChange={(event) => {
							setValue("originator", event.target.value, { shouldValidate: true });
						}}
						label="Originator" />

					<RHFTextField
						name="discipline"
						onChange={(event) => {
							setValue("discipline", event.target.value, { shouldValidate: true });
						}}
						label="Discipline" />

				</Stack>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<RHFTextField
						name="document_type"
						onChange={(event) => {
							setValue("document_type", event.target.value, { shouldValidate: true });
						}}
						label="Type" />

					<RHFTextField
						name="document_zone"
						label="Zone (Optional)"
					/>

					<RHFTextField
						name="document_level"
						label="Level (Optional)"
					/>

				</Stack>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<RHFTextField disabled name="sequence_no" label="Sequence No." />

					<Box width={1} />
					<Box width={1} />

				</Stack>
			</Stack>

			<Stack spacing={3}>
				<Typography variant="h6" sx={{ color: 'text.disabled' }}>
					First Aid Information
				</Typography>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<PersonelAutocomplete
						value={getAutocompleteValue(values.injured_id)}
						onChange={(_event, newValue) => {
							if (newValue) {
								setValue('injured_id', newValue.id, { shouldValidate: true, shouldDirty: true });
							} else {
								setValue('injured_id', '', { shouldValidate: true, shouldDirty: true });
							}
						}}
						isOptionEqualToValue={(option, value) => option.label === value}
						options={options}
						label="Name of the injured"
						error={errors?.injured_id?.message}
					/>

					<PersonelAutocomplete
						value={getAutocompleteValue(values.engineer_id)}
						onChange={(_event, newValue) => {
							if (newValue) {
								setValue('engineer_id', newValue.id, { shouldValidate: true, shouldDirty: true });
							} else {
								setValue('engineer_id', '', { shouldValidate: true, shouldDirty: true });
							}
						}}
						isOptionEqualToValue={(option, value) => option.label === value}
						options={options}
						label="Site Engineer"
						error={errors?.engineer_id?.message}
					/>

					<PersonelAutocomplete
						value={getAutocompleteValue(values.first_aider_id)}
						isOptionEqualToValue={(option, value) => option.label === value}
						onChange={(_event, newValue) => {
							if (newValue) {
								setValue('first_aider_id', newValue.id, { shouldValidate: true, shouldDirty: true });
							} else {
								setValue('first_aider_id', '', { shouldValidate: true, shouldDirty: true });
							}
						}}
						options={options}
						label="First Aider"
						error={errors?.first_aider_id?.message}
					/>
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<RHFTextField
						name="site"
						label="Site Name"
						onChange={(event) => {
							setValue("site", event.target.value, { shouldValidate: true });
						}}
					/>

					<RHFTextField
						name="location"
						label="Location"
						onChange={(event) => {
							setValue("location", event.target.value, { shouldValidate: true });
						}}
					/>

					<Box width={1} />

				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<RHFTextField label="Nurse Findings (Optional)" fullWidth multiline name="findings" rows={3} />
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<RHFTextField label="First Aid Given" fullWidth multiline name="first_aid" rows={3} />
				</Stack>
			</Stack>

		</Stack>
	)
}

function PersonelAutocomplete ({ value, onChange, options, label, error = "", ...others }) {
	return (
		<Autocomplete
			fullWidth
			value={value}
			onChange={onChange}
			options={options}
			renderOption={(props, option) => {
				return (
					<li {...props} key={props.id}>
						{option.label}
					</li>
				);
			}}
			renderInput={(params) => <TextField label={label} {...params} error={!!error} helperText={error} />}
			{...others}
		/>
	)
}

export default GeneralIncident