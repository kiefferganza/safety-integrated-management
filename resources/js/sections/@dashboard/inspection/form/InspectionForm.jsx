import { RHFTextField } from '@/Components/hook-form'
import useResponsive from '@/hooks/useResponsive';
import { Autocomplete, Chip, Divider, Grid, Stack, TextField } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';

const InspectionForm = ({ personel }) => {
	const [cc, setCC] = useState([]);
	const [time, setTime] = useState(null);
	const [inspDate, setInspDate] = useState(null);
	const isDesktop = useResponsive('up', 'sm');
	const { setValue, watch, formState: { errors } } = useFormContext();
	const values = watch();

	const handleChangeTime = (val) => {
		setTime(val);
		setValue('inspected_time', format(val, "d-MMM-yyyy HH:mm").split(" ")[1], { shouldDirty: true, shouldValidate: true });
	}

	const handleChangeDate = (val) => {
		setInspDate(val);
		// setValue('inspected_date', format(val, "d-MMM-yyyy"), { shouldDirty: true, shouldValidate: true });
	}

	const getAutocompleteValue = (id) => {
		const findPerson = personel.find(per => per.employee_id == id);
		if (findPerson) {
			return `${findPerson.firstname} ${findPerson.lastname}`
		}
		return null;
	}


	const options = personel.map((option) => ({ id: option.employee_id, label: `${option?.firstname} ${option?.lastname}` }));

	return (
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

					<RHFTextField disabled name="sequence_no" label="Squence No." />

					<RHFTextField disabled name="inspected_by" label="Inspected By" />

					<RHFTextField name="location" label="Location" />

				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>


					<RHFTextField name="accompanied_by" label="Accompanied By" />

					<PersonelAutocomplete
						value={getAutocompleteValue(values.reviewer_id)}
						onChange={(_event, newValue) => {
							if (newValue) {
								setValue('reviewer_id', newValue.id, { shouldValidate: true, shouldDirty: true });
							} else {
								setValue('reviewer_id', '', { shouldValidate: true, shouldDirty: true });
							}
						}}
						options={options}
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
						options={options}
						label="Verified By"
						error={errors?.verifier_id?.message}
					/>

				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					{isDesktop ? (
						<DesktopDatePicker
							label="Inspected Date"
							inputFormat="MM/dd/yyyy"
							value={inspDate}
							onChange={handleChangeDate}
							renderInput={(params) => <TextField {...params} fullWidth error={!!errors?.inspected_date?.message} helperText={errors?.inspected_date?.message} />}
						/>
					) : (
						<MobileDatePicker
							label="Inspected Date"
							inputFormat="MM/dd/yyyy"
							value={inspDate}
							onChange={handleChangeDate}
							renderInput={(params) => <TextField {...params} fullWidth error={!!errors?.inspected_date?.message} helperText={errors?.inspected_date?.message} />}
						/>
					)}

					<TimePicker
						label="Inspected Time"
						value={time}
						onChange={handleChangeTime}
						renderInput={(params) => <TextField {...params} fullWidth error={!!errors?.inspected_time?.message} helperText={errors?.inspected_time?.message} />}
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