import { RHFTextField } from '@/Components/hook-form'
import { Autocomplete, Box, Chip, Divider, Stack, TextField, Typography } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import useResponsive from '@/hooks/useResponsive';

const InspectionForm = ({ personel }) => {
	const isDesktop = useResponsive('up', 'sm');
	const [cc, setCC] = useState([]);
	const [time, setTime] = useState(null);
	const [inspDate, setInspDate] = useState(null);
	const { setValue, watch, formState: { errors } } = useFormContext();
	const values = watch();

	const handleChangeTime = (val) => {
		setTime(val);
		setValue('inspected_time', format(val, "d-MMM-yyyy HH:mm").split(" ")[1], { shouldDirty: true, shouldValidate: true });
	}

	const handleChangeDate = (val) => {
		setInspDate(val);
		setValue('inspected_date', format(val, "d-MMM-yyyy"), { shouldDirty: true, shouldValidate: true });
	}

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

					<RHFTextField disabled name="sequence_no" label="Sequence No." />

					<Box width={1} />
					<Box width={1} />

				</Stack>
			</Stack>

			<Stack spacing={3}>
				<Typography variant="h6" sx={{ color: 'text.disabled' }}>
					Inspection Detail
				</Typography>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<RHFTextField name="contract_no" label="Contract No." />

					<RHFTextField disabled name="inspected_by" label="Inspected By" />

					<RHFTextField name="accompanied_by" label="Accompanied By" />


				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<RHFTextField name="location" label="Location" />

					{isDesktop ? (
						<DesktopDatePicker
							label="Inspected Date"
							inputFormat="d-MMM-yyyy"
							disableMaskedInput
							value={inspDate}
							onChange={handleChangeDate}
							renderInput={(params) => <TextField {...params} fullWidth error={!!errors?.inspected_date?.message} helperText={errors?.inspected_date?.message} />}
						/>
					) : (
						<MobileDatePicker
							label="Inspected Date"
							inputFormat="d-MMM-yyyy"
							value={inspDate}
							disableMaskedInput
							onChange={handleChangeDate}
							renderInput={(params) => <TextField {...params} fullWidth error={!!errors?.inspected_date?.message} helperText={errors?.inspected_date?.message} />}
						/>
					)}

					<TimePicker
						label="Inspected Time"
						value={time}
						disableMaskedInput
						onChange={handleChangeTime}
						renderInput={(params) => <TextField {...params} readOnly fullWidth error={!!errors?.inspected_time?.message} helperText={errors?.inspected_time?.message} />}
					/>

				</Stack>
			</Stack>

			<Stack spacing={3}>
				<Typography variant="h6" sx={{ color: 'text.disabled' }}>
					Action & Closeout Details <Typography variant="caption" fontStyle="italic">(Email Notification)</Typography>
				</Typography>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<PersonelAutocomplete
						value={getAutocompleteValue(values.reviewer_id)}
						onChange={(_event, newValue) => {
							if (newValue) {
								setValue('reviewer_id', newValue.id, { shouldValidate: true, shouldDirty: true });
							} else {
								setValue('reviewer_id', '', { shouldValidate: true, shouldDirty: true });
							}
						}}
						options={options.filter(emp => emp.user_id)}
						label="Action By"
						error={errors?.reviewer_id?.message}
					/>

					<PersonelAutocomplete
						value={getAutocompleteValue(values.verifier_id)}
						onChange={(_event, newValue) => {
							if (newValue) {
								setValue('verifier_id', newValue.id, { shouldValidate: true, shouldDirty: true });
							} else {
								setValue('verifier_id', '', { shouldValidate: true, shouldDirty: true });
							}
						}}
						options={options.filter(emp => emp.user_id)}
						label="Verified By"
						error={errors?.verifier_id?.message}
					/>
					<Autocomplete
						multiple
						freeSolo
						fullWidth
						value={cc}
						onChange={(_event, newValue) => {
							setCC(newValue);
						}}
						options={options}
						renderTags={(value, getTagProps) =>
							value.map((option, index) => (
								<Chip {...getTagProps({ index })} key={index} size="small" label={option?.label || option} />
							))
						}
						renderInput={(params) => <TextField label="Add CC" {...params} fullWidth />}
					/>

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

export default InspectionForm