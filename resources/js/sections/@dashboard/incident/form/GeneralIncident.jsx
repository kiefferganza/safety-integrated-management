import { useRef, useState } from 'react';
import { RHFMuiSelect, RHFTextField, RHFUpload } from '@/Components/hook-form';
import { Autocomplete, Box, Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Switch, TextField, Typography } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { useFormContext } from 'react-hook-form';
import SignaturePad from 'react-signature-canvas';

const DR_OPTIONS = [
	{ label: 'Yes', value: 1 },
	{ label: 'No', value: 0 }
];

const canvasStyles = {
	width: "280px",
	height: "240px"
};

const GeneralIncident = ({ personel, projectDetails }) => {
	const [seeDr, setSeeDr] = useState(false);
	const [imageSign, setImageSign] = useState(false);
	const { setValue, watch, formState: { errors } } = useFormContext();
	const values = watch();
	const sigPadRef = useRef();

	const getAutocompleteValue = (id) => {
		const findPerson = personel.find(per => per.employee_id == id);
		if (findPerson) {
			return `${findPerson.firstname} ${findPerson.lastname}`
		}
		return null;
	}

	const handleDrChange = (e) => {
		const value = Number(e.target.value);
		setSeeDr(value);
		if (value === 0) {
			setValue("dr_name", null)
			setValue("dr_phone", null)
		}
	}

	const handleSignitureChange = () => {
		setValue("employee_signiture", null);
		setImageSign(currState => !currState);
	}

	const handleClearSign = () => {
		sigPadRef.current.clear();
		setValue("employee_signiture", null);
	}

	const handleEndSign = () => {
		const canvas = sigPadRef.current.getTrimmedCanvas();
		if (canvas) {
			canvas.toBlob((blob) => {
				let file = new File([blob], "signature.png", { type: "image/png" });
				setValue("employee_signiture", file);
			}, 'image/png');
		}
	}

	const handleDrop = (acceptedFiles) => {
		if (acceptedFiles[0]) {
			setValue("employee_signiture", Object.assign(acceptedFiles[0], {
				preview: URL.createObjectURL(acceptedFiles[0]),
			}));
		}
	}


	const options = personel.map((option) => ({ id: option.employee_id, label: `${option?.firstname} ${option?.lastname}`, user_id: option.user_id }));

	return (
		<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
			<Stack spacing={3}>
				<Typography variant="h6" sx={{ color: 'text.disabled' }}>
					Project Detail
				</Typography>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<RHFMuiSelect
						label="Project Code"
						name="project_code"
						fullWidth
						options={projectDetails['Project Code'] ? [{ label: '', value: '' }, ...projectDetails['Project Code'].map((d) => ({ label: d.value, value: d.value }))] : []}
					/>

					<RHFMuiSelect
						label="Originator"
						name="originator"
						fullWidth
						options={projectDetails['Originator'] ? [{ label: '', value: '' }, ...projectDetails['Originator'].map((d) => ({ label: d.value, value: d.value }))] : []}
					/>

					<RHFMuiSelect
						label="Discipline"
						name="discipline"
						fullWidth
						options={projectDetails['Discipline'] ? [{ label: '', value: '' }, ...projectDetails['Discipline'].map((d) => ({ label: d.value, value: d.value }))] : []}
					/>

				</Stack>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

					<RHFMuiSelect
						label="Type"
						name="document_type"
						fullWidth
						options={projectDetails['Type'] ? [{ label: '', value: '' }, ...projectDetails['Type'].map((d) => ({ label: d.value, value: d.value }))] : []}
					/>

					<RHFMuiSelect
						label="Zone (Optional)"
						name="document_zone"
						fullWidth
						options={projectDetails['Zone'] ? [{ label: '', value: '' }, ...projectDetails['Zone'].map((d) => ({ label: d.value, value: d.value }))] : []}
					/>

					<RHFMuiSelect
						label="Level (Optional)"
						name="document_level"
						fullWidth
						options={projectDetails['Level'] ? [{ label: '', value: '' }, ...projectDetails['Level'].map((d) => ({ label: d.value, value: d.value }))] : []}
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
					Report of Injury
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
						value={getAutocompleteValue(values.supervisor_id)}
						onChange={(_event, newValue) => {
							if (newValue) {
								setValue('supervisor_id', newValue.id, { shouldValidate: true, shouldDirty: true });
							} else {
								setValue('supervisor_id', '', { shouldValidate: true, shouldDirty: true });
							}
						}}
						isOptionEqualToValue={(option, value) => option.label === value}
						options={options}
						label="Supervisor"
						error={errors?.supervisor_id?.message}
					/>

					<MobileDateTimePicker
						label="Incident Date & Time"
						inputFormat="d-MMM-yyyy hh:mmaaa"
						value={values?.incident_date}
						maxDate={new Date()}
						onChange={(date) => {
							setValue("incident_date", date, { shouldValidate: true });
						}}
						renderInput={(params) =>
							<TextField {...params} fullWidth error={!!errors?.incident_date?.message} helperText={errors?.incident_date?.message} />
						}
					/>


				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<RHFTextField
						name="location"
						label="Location"
						onChange={(event) => {
							setValue("location", event.target.value, { shouldValidate: true });
						}}
					/>
					<Box width={1} />
					<Box width={1} />
				</Stack>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<FormControl fullWidth>
						<FormLabel id="dr-radio-label">Did you see a doctor about this injury/illness?</FormLabel>
						<RadioGroup aria-labelledby="dr-radio-label" onChange={handleDrChange} row>
							{DR_OPTIONS.map((option, idx) => (
								<FormControlLabel key={idx} value={option.value} control={<Radio />} label={option.label} />
							))}
						</RadioGroup>
					</FormControl>
					{seeDr === 1 && (
						<>
							<RHFTextField
								label="Dr. Name"
								name="dr_name"
								onChange={(event) => {
									setValue("dr_phone", event.target.value, { shouldDirty: true });
								}}
							/>
							<RHFTextField
								label="Doctor's phone number:"
								name="dr_phone"
								onChange={(event) => {
									setValue("dr_phone", event.target.value, { shouldDirty: true });
								}}
							/>
						</>
					)}
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<RHFTextField label="Names of witnesses (if any)" fullWidth multiline name="witnesses" rows={3} />
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<RHFTextField label="Describe step by step what led up to the injury/near miss" fullWidth multiline name="step_by_step" rows={3} />
				</Stack>
				<Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
					<Typography variant="h6" sx={{ color: 'text.disabled' }}>
						Injured Signiture
					</Typography>
					<FormControlLabel
						control={<Switch color="primary" checked={imageSign} onChange={handleSignitureChange} />}
						label="Image Signiture"
						labelPlacement="start"
					/>
				</Stack>
				<Stack spacing={3} sx={{ width: 1 }} alignItems="center">
					{imageSign ? (
						<RHFUpload
							name="employee_signiture"
							maxSize={3145728}
							onDrop={handleDrop}
							onDelete={() => {
								setValue("employee_signiture", null);
							}}
						/>
					) : (
						<Stack>
							<Box width={280} height={240} sx={{ borderWidth: 4, borderStyle: "solid", borderColor: "primary.main", borderRadius: 2 }}>
								<SignaturePad ref={sigPadRef} canvasProps={canvasStyles} onEnd={handleEndSign} />
							</Box>
							<Stack direction="row" justifyContent="flex-end">
								<Button onClick={handleClearSign}>Clear</Button>
							</Stack>
						</Stack>
					)}
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