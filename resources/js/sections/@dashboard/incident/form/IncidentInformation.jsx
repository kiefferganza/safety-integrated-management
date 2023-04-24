import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { RHFAutocomplete, RHFTextField, RHFUpload } from '@/Components/hook-form';
import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Switch, TextField, Typography } from '@mui/material';
import SignaturePad from 'react-signature-canvas';

const PREV_OPTIONS = [
	"Stop this activity",
	"Guard the hazard",
	"Train the employee(s)",
	"Train the supervisor(s) ",
	"Redesign task steps",
	"Redesign work station",
	"Write a new policy/rule",
	"Enforce existing policy",
	"Routinely inspect for the hazard",
	"Personal Protective Equipment"
];

const WORK_OPTIONS = [
	"Entering or leaving work",
	"Doing normal work activities",
	"During meal period",
	"During break",
	"Working overtime",
];

const UNSAFE_WORKPLACE_OPTIONS = [
	"Inadequate guard",
	"Unguarded hazard",
	"Safety device is defective",
	"Tool or equipment defective",
	"Workstation layout is hazardous",
	"Unsafe lighting",
	"Unsafe ventilation",
	"Lack of needed personal protective equipment",
	"Lack of appropriate equipment / tools",
	"Unsafe clothing",
	"No training or insufficient training",
];

const UNSAFE_ACT_OPTIONS = [
	"Operating without permission",
	"Operating at unsafe speed",
	"Servicing equipment that has power to it",
	"Making a safety device inoperative",
	"Using defective equipment",
	"Using equipment in an unapproved way",
	"Unsafe lifting",
	"Taking an unsafe position or posture",
	"Distraction, teasing, horseplay",
	"Failure to wear personal protective equipment",
	"Failure to use the available equipment / tools",

];

const canvasStyles = {
	width: "280px",
	height: "240px"
};

const IncidentInformation = ({ types }) => {
	const [imageSign, setImageSign] = useState(false);
	const { setValue, watch, formState: { errors } } = useFormContext();
	const values = watch();
	const sigPadRef = useRef();

	const handleBodyPartChange = (e) => {
		const value = e.target.value;
		const bodyParts = values.body_part.split(",").filter((part) => !!part);
		const bodyPartIdx = bodyParts.findIndex((part) => part === value);
		if (bodyPartIdx === -1) {
			bodyParts.push(value);
		} else {
			bodyParts.splice(bodyPartIdx, 1)
		}
		setValue('body_part', bodyParts.join(",").trim(), { shouldValidate: true, shouldDirty: true })
	}

	const handleEquipmentChange = (e) => {
		const value = e.target.value;
		const equipments = values.equipment.split(",").filter((part) => !!part);
		const equipmentIdx = equipments.findIndex((part) => part === value);
		if (equipmentIdx === -1) {
			equipments.push(value);
		} else {
			equipments.splice(equipmentIdx, 1)
		}
		setValue('equipment', equipments.join(",").trim(), { shouldValidate: true, shouldDirty: true })
	}

	const handleUnsafeWorkplaceChange = (e) => {
		const value = e.target.value;
		const unsafeWorkplace = values.unsafe_workplace.split(",").filter((unsafe) => !!unsafe);
		const unsafeWorkplaceIdx = unsafeWorkplace.findIndex((unsafe) => unsafe === value);

		if (unsafeWorkplaceIdx === -1) {
			unsafeWorkplace.push(value);
		} else {
			unsafeWorkplace.splice(unsafeWorkplaceIdx, 1)
		}
		setValue('unsafe_workplace', unsafeWorkplace.join(",").trim(), { shouldValidate: true, shouldDirty: true })
	}

	const handleUnsafeActChange = (e) => {
		const value = e.target.value;
		const unsafeAct = values.unsafe_act.split(",").filter((unsafe) => !!unsafe);
		const unsafeActIdx = unsafeAct.findIndex((unsafe) => unsafe === value);
		if (unsafeActIdx === -1) {
			unsafeAct.push(value);
		} else {
			unsafeAct.splice(unsafeActIdx, 1)
		}
		setValue('unsafe_act', unsafeAct.join(",").trim(), { shouldValidate: true, shouldDirty: true })
	}

	const handleSignitureChange = () => {
		setValue("supervisor_signiture", null);
		setImageSign(currState => !currState);
	}

	const handleClearSign = () => {
		sigPadRef.current.clear();
		setValue("supervisor_signiture", null);
	}

	const handleEndSign = () => {
		const canvas = sigPadRef.current.getTrimmedCanvas();
		if (canvas) {
			canvas.toBlob((blob) => {
				let file = new File([blob], "signature.png", { type: "image/png" });
				setValue("supervisor_signiture", file);
			}, 'image/png');
		}
	}

	const handleDrop = (acceptedFiles) => {
		if (acceptedFiles[0]) {
			setValue("supervisor_signiture", Object.assign(acceptedFiles[0], {
				preview: URL.createObjectURL(acceptedFiles[0]),
			}));
		}
	}

	return (
		<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
			<Stack spacing={3}>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<RHFTextField
						name="day_loss"
						label="Number of days loss"
						value={values.day_loss === 0 ? "" : values.day_loss}
						onChange={(event) => {
							setValue('day_loss', Number(event.target.value), { shouldValidate: true, shouldDirty: true });
						}}
						InputLabelProps={{ shrink: true }}
						InputProps={{
							type: 'number',
						}}
					/>

					<RHFAutocomplete
						name="severity"
						fullWidth
						onChange={(_event, newValue) => setValue('severity', newValue, { shouldValidate: true, shouldDirty: true })}
						options={types.severity.map((option) => option.name)}
						getOptionLabel={(option) => option}
						renderInput={(params) => <TextField label="Potential Severity" {...params} error={!!errors?.severity?.message} helperText={errors?.severity?.message} />}
					/>

					<Box width={1} />
				</Stack>
			</Stack>
			<Stack spacing={5} divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<FormControl fullWidth error={!!errors?.incident?.message}>
						<FormLabel id="incident-radio-label">Incident Classification</FormLabel>
						<RadioGroup aria-labelledby="incident-radio-label" row onChange={(e) => setValue("incident", e.target.value)}>
							{types.incident.map((option) => {
								const label = `${option.name}${option.description ? " (" + option.description + ")" : ""}`;
								return <FormControlLabel key={option.name} value={option.name} control={<Radio />} label={label} />
							})}
						</RadioGroup>
					</FormControl>
				</Stack>


				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<FormControl fullWidth error={!!errors?.root_cause?.message}>
						<FormLabel id="root-cause-radio-label">Root cause of incident/near</FormLabel>
						<RadioGroup
							aria-labelledby="root-cause-radio-label"
							row
							onChange={(e) => {
								setValue("root_cause", e.target.value, { shouldValidate: true });
								setValue("root_cause_other", "", { shouldValidate: true });
							}}
						>
							{types.root_cause.map((option) => {
								const label = `${option.name}${option.description ? " (" + option.description + ")" : ""}`;
								return <FormControlLabel key={option.name} value={option.name} control={<Radio checked={option.name === values.root_cause} />} label={label} />
							})}
							<FormControlLabel
								labelPlacement="start"
								control={
									<RHFTextField
										sx={{ ml: 1 }}
										variant="standard"
										size="small"
										margin="none"
										name="root_cause_other"
										onChange={(e) => {
											setValue("root_cause_other", e.target.value, { shouldValidate: true });
											setValue("root_cause", "", { shouldValidate: true });
										}}
									/>}
								label="Other" />
						</RadioGroup>
					</FormControl>
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<FormControl fullWidth error={!!errors?.root_cause?.message}>
						<FormLabel id="equipment-radio-label">Equipment Involved</FormLabel>
						<RadioGroup
							aria-labelledby="equipment-radio-label"
							row
							onChange={(e) => {
								setValue("equipment", e.target.value, { shouldValidate: true });
							}}
						>
							{types.equipment.map((option) => {
								const label = `${option.name}${option.description ? " (" + option.description + ")" : ""}`;
								return <FormControlLabel key={option.name} value={option.name} control={<Checkbox checked={values.equipment.split(",").some((name) => name === option.name)} onChange={handleEquipmentChange} />} label={label} />
							})}
						</RadioGroup>
					</FormControl>
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<FormControl fullWidth error={!!errors?.mechanism?.message}>
						<FormLabel id="mechanism-radio-label">Mechanism of incident/near</FormLabel>
						<RadioGroup
							aria-labelledby="mechanism-radio-label"
							row
							onChange={(e) => {
								setValue("mechanism", e.target.value, { shouldValidate: true });
								setValue("mechanism_other", "", { shouldValidate: true });
							}}
						>
							{types.mechanism.map((option) => {
								const label = `${option.name}${option.description ? " (" + option.description + ")" : ""}`;
								return <FormControlLabel key={option.name} value={option.name} control={<Radio checked={option.name === values.mechanism} />} label={label} />
							})}
							<FormControlLabel
								labelPlacement="start"
								control={
									<RHFTextField
										sx={{ ml: 1 }}
										variant="standard"
										size="small"
										margin="none"
										name="mechanism_other"
										onChange={(e) => {
											setValue("mechanism_other", e.target.value, { shouldValidate: true });
											setValue("mechanism", "", { shouldValidate: true });
										}}
									/>}
								label="Other" />
						</RadioGroup>
					</FormControl>
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<FormControl fullWidth error={!!errors?.indicator?.message}>
						<FormLabel id="indicator-radio-label">Leading Indicator</FormLabel>
						<RadioGroup aria-labelledby="indicator-radio-label" row onChange={(e) => setValue("indicator", e.target.value)}>
							{types.indicator.map((option) => {
								const label = `${option.name}${option.description ? " (" + option.description + ")" : ""}`;
								return <FormControlLabel key={option.name} value={option.name} control={<Radio />} label={label} />
							})}
						</RadioGroup>
					</FormControl>
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<FormControl fullWidth error={!!errors?.nature?.message}>
						<FormLabel id="nature-radio-label">Nature of injury: (most serious one)</FormLabel>
						<RadioGroup
							aria-labelledby="nature-radio-label"
							row
							onChange={(e) => {
								setValue("nature", e.target.value);
								setValue("nature_other", "")
							}}
						>
							{types.nature.map((option) => (
								<FormControlLabel key={option.name} value={option.name} control={<Radio checked={option.name === values.nature} />} label={option.name} />
							))}
							<FormControlLabel
								labelPlacement="start"
								control={
									<RHFTextField
										sx={{ ml: 1 }}
										variant="standard"
										size="small"
										margin="none"
										name="nature_other"
										onChange={(e) => {
											setValue("nature_other", e.target.value);
											setValue("nature", "");
										}}
									/>}
								label="Other" />
						</RadioGroup>
					</FormControl>
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<FormControl fullWidth error={!!errors?.body_part?.message}>
						<FormLabel id="body-part-radio-label">Part of body affected:</FormLabel>
						<RadioGroup aria-labelledby="body-part-radio-label" row>
							{types.body_part.map((option) => (
								<FormControlLabel key={option.name} value={option.name} control={<Checkbox checked={values.body_part.split(",").some((name) => name === option.name)} onChange={handleBodyPartChange} />} label={option.name} />
							))}
						</RadioGroup>
					</FormControl>
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<FormControl fullWidth error={!!errors?.workday?.message}>
						<FormLabel id="workday-radio-label">What part of employee's workday?</FormLabel>
						<RadioGroup aria-labelledby="workday-radio-label" row onChange={(e) => setValue("workday", e.target.value)}>
							{WORK_OPTIONS.map((option, idx) => (
								<FormControlLabel key={idx} value={option} control={<Radio />} label={option} />
							))}
						</RadioGroup>
					</FormControl>
				</Stack>

				<Stack spacing={5}>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
						<FormControl fullWidth>
							<FormLabel id="unsafe-workplace-label">Unsafe workplace conditions: (Check all that apply)</FormLabel>
							<RadioGroup aria-labelledby="unsafe-workplace-label" row>
								{UNSAFE_WORKPLACE_OPTIONS.map((option) => (
									<FormControlLabel key={option} value={option} control={<Checkbox checked={values.unsafe_workplace.split(",").some((name) => name === option)} onChange={handleUnsafeWorkplaceChange} />} label={option} />
								))}
								<FormControlLabel
									labelPlacement="start"
									control={<RHFTextField variant="standard" size="small" margin="none" name="unsafe_workplace_other" />}
									label="Other"
								/>
							</RadioGroup>
						</FormControl>
					</Stack>

					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
						<RHFTextField label="Why did the unsafe conditions exist?" fullWidth multiline name="unsafe_workplace_reason" rows={3} />
					</Stack>

					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
						<FormControl fullWidth>
							<FormLabel id="unsafe-act-label">Unsafe acts by people: (Check all that apply)</FormLabel>
							<RadioGroup aria-labelledby="unsafe-act-label" row>
								{UNSAFE_ACT_OPTIONS.map((option) => (
									<FormControlLabel key={option} value={option} control={<Checkbox checked={values.unsafe_act.split(",").some((name) => name === option)} onChange={handleUnsafeActChange} />} label={option} />
								))}
								<FormControlLabel
									labelPlacement="start"
									control={
										<RHFTextField
											sx={{ ml: 1 }}
											variant="standard"
											size="small"
											margin="none"
											name="unsafe_act_other"
										/>}
									label="Other" />
							</RadioGroup>
						</FormControl>
					</Stack>

					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
						<RHFTextField label="Why did the unsafe acts occur?" fullWidth multiline name="unsafe_act_reason" rows={3} />
					</Stack>
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<FormControl fullWidth sx={{ flexDirection: "row", alignItems: "center" }}>
						<FormLabel id="similar-incident-radio-label">Have there been similar incidents or near misses prior to this one? </FormLabel>
						<RadioGroup aria-labelledby="similar-incident-radio-label" row onChange={(e) => setValue("similar_incident", e.target.value)}>
							<FormControlLabel labelPlacement="start" value="Yes" control={<Radio />} label="Yes" />
							<FormControlLabel labelPlacement="start" value="No" control={<Radio />} label="No" />
						</RadioGroup>
					</FormControl>
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<FormControl fullWidth>
						<FormLabel id="prevention-radio-label">What changes do you suggest to prevent this incident/near miss from happening again?</FormLabel>
						<RadioGroup aria-labelledby="prevention-radio-label" row onChange={() => setValue("prevention", "")}>
							{PREV_OPTIONS.map((option, idx) => (
								<FormControlLabel key={idx} value={option} control={<Radio />} label={option} />
							))}
						</RadioGroup>
					</FormControl>
				</Stack>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
					<RHFTextField label="Remarks (Optional)" fullWidth multiline name="remarks" rows={3} />
				</Stack>

				<Stack>
					<Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
						<Typography variant="h6" sx={{ color: 'text.disabled' }}>
							Supervisor Signiture
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
								name="supervisor_signiture"
								maxSize={3145728}
								onDrop={handleDrop}
								onDelete={() => {
									setValue("supervisor_signiture", null);
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
		</Stack>
	)
}

export default IncidentInformation