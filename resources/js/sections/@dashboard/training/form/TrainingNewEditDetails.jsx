import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Box, Stack, Button, Divider, Typography, TextField, Autocomplete, FormHelperText } from '@mui/material';
// components
import { RHFAutocomplete, RHFTextField } from '@/Components/hook-form';
import DateRangePicker, { useDateRangePicker } from '@/Components/date-range-picker';
import Iconify from '@/Components/iconify';
import TrainingEmployeeDialog from './TrainingEmployeeDialog';
import TrainingParticipantTable from './TrainingParticipantTable';
import { format } from 'date-fns';
import { currencies } from '@/_mock/arrays/_currencies';

// ----------------------------------------------------------------------

const TrainingNewEditDetails = ({ currentTraining, isEdit }) => {
	const { personel } = usePage().props;
	const [openParticipants, setOpenParticipants] = useState(false);
	const { setValue, watch, formState: { errors } } = useFormContext();
	const values = watch();

	const {
		startDate,
		endDate,
		onChangeStartDate,
		onChangeEndDate,
		open: openPicker,
		onOpen: onOpenPicker,
		onClose: onClosePicker,
		isSelected: isSelectedValuePicker,
		isError,
		shortLabel,
		setStartDate,
		setEndDate
	} = useDateRangePicker();

	useEffect(() => {
		if (currentTraining && isEdit && currentTraining?.training_date && currentTraining?.date_expired) {
			setStartDate(new Date(currentTraining?.training_date));
			setEndDate(new Date(currentTraining?.date_expired));
		}
	}, [currentTraining]);

	const handleChangeStartDate = (newValue) => {
		onChangeStartDate(newValue);
	};

	const handleChangeEndDate = (newValue) => {
		onChangeEndDate(newValue);
	};

	const handleCloseDate = () => {
		if (!isError && (startDate && endDate)) {
			setValue("training_date", format(startDate, "yyyy-MM-dd HH:mm:ss"), { shouldValidate: true, shouldDirty: true });
			setValue("date_expired", format(endDate, "yyyy-MM-dd HH:mm:ss"), { shouldValidate: true, shouldDirty: true });
		}
		onClosePicker();
	}

	const handleOpenParticipants = () => {
		setOpenParticipants(true);
	};

	const handleCloseParticipants = () => {
		setOpenParticipants(false);
	};

	const handleSelectParticipants = (value) => {
		const isSelected = values.trainees.findIndex(tr => tr?.emp_id === value.employee_id);
		if (isSelected !== -1) {
			if (isEdit) {
				const deleted_trainees = values?.deleted_trainees || []
				setValue("deleted_trainees", [
					...deleted_trainees,
					{
						...values.trainees[isSelected].pivot
					}
				], { shouldValidate: true, shouldDirty: true });
			}
			setValue("trainees", values.trainees.filter(tr => tr.emp_id !== value.employee_id), { shouldValidate: true, shouldDirty: true });
		} else {
			setValue("trainees", [
				...values.trainees,
				{
					fullname: `${value.firstname} ${value.lastname}`,
					position: value.position,
					emp_id: value.employee_id,
					user_id: value.user_id,
					src: null
				}
			], { shouldValidate: true, shouldDirty: true });
		}
	}

	const getAutocompleteValue = (id) => {
		const findPerson = personel.find(per => per.employee_id == id);
		if (findPerson) {
			return `${findPerson.firstname} ${findPerson.lastname}`
		}
		return null;
	}

	return (
		<Box sx={{ p: 3 }}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
				<Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
					Course Details
				</Typography>
				<Box>
					<Button
						variant="soft"

						color={!!errors?.training_date?.message || !!errors?.date_expired?.message ? "error" : "inherit"}
						sx={{
							textTransform: 'unset',
							color: 'text.secondary',
							width: { xs: 1, md: 240 },
							height: 1,
							justifyContent: 'flex-start',
							fontWeight: 'fontWeightMedium',
							...(isSelectedValuePicker && {
								color: 'text.primary',
							}),
						}}
						startIcon={<Iconify icon="eva:calendar-fill" />}
						onClick={onOpenPicker}
					>
						{isSelectedValuePicker ? shortLabel : 'Training Date Range'}
					</Button>
				</Box>
			</Stack>

			<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
				<Stack alignItems="flex-end" spacing={2}>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

						<RHFTextField disabled name="sequence_no" label="Squence No." fullWidth />

						<RHFTextField name="title" label="Course Title" fullWidth />

						<RHFTextField name="location" label="Training Location" fullWidth />

					</Stack>

					<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
						<Autocomplete
							clearOnEscape
							name="trainer"
							options={personel}
							fullWidth
							freeSolo
							inputValue={values.trainer}
							getOptionLabel={(option, value) => (`${option?.firstname} ${option?.lastname}`)}
							renderOption={(props, option) => {
								return (
									<li {...props} key={option.employee_id}>
										{`${option?.firstname} ${option?.lastname}`}
									</li>
								);
							}}
							onInputChange={(event) => {
								if (event?.type === "change") {
									setValue('trainer', event.target.value, { shouldValidate: true, shouldDirty: true });
								} else {
									setValue('trainer', '', { shouldValidate: true, shouldDirty: true });
								}
							}}
							onChange={(_event, newValue) => {
								if (newValue) {
									setValue('trainer', `${newValue?.firstname} ${newValue?.lastname}`, { shouldValidate: true, shouldDirty: true });
								} else {
									setValue('trainer', '', { shouldValidate: true, shouldDirty: true });
								}
							}}
							renderInput={(params) =>
								<TextField
									{...params}
									label="Conducted by:"
									value={values.trainer}
									error={!!errors?.trainer?.message}
									helperText={errors?.trainer?.message || ""}
								/>
							}
						/>


						<RHFTextField name="contract_no" label="Contract No." fullWidth />

						<RHFTextField name="training_hrs" label="Training Hours" type="number" fullWidth />

					</Stack>

					{values.type == "3" && (
						<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
							<Autocomplete
								fullWidth
								value={getAutocompleteValue(values.reviewed_by)}
								onChange={(_event, newValue) => {
									if (newValue) {
										setValue('reviewed_by', newValue.id, { shouldValidate: true, shouldDirty: true });
									} else {
										setValue('reviewed_by', '', { shouldValidate: true, shouldDirty: true });
									}
								}}
								options={personel.map((option) => ({ id: option.employee_id, label: `${option?.firstname} ${option?.lastname}` }))}
								renderOption={(props, option) => {
									return (
										<li {...props} key={option.id}>
											{option.label}
										</li>
									);
								}}
								renderInput={(params) => <TextField label="Reviewed By:" {...params} />}
							/>
							<Autocomplete
								fullWidth
								value={getAutocompleteValue(values.approved_by)}
								onChange={(_event, newValue) => {
									if (newValue) {
										setValue('approved_by', newValue.id, { shouldValidate: true, shouldDirty: true });
									} else {
										setValue('approved_by', '', { shouldValidate: true, shouldDirty: true });
									}
								}}
								options={personel.map((option) => ({ id: option.employee_id, label: `${option?.firstname} ${option?.lastname}` }))}
								renderOption={(props, option) => {
									return (
										<li {...props} key={option.id}>
											{option.label}
										</li>
									);
								}}
								renderInput={(params) => <TextField label="Approved By:" {...params} />}
							/>

							<RHFTextField name="training_center" label="Training Center" fullWidth />
						</Stack>
					)}

				</Stack>

			</Stack>

			<Divider sx={{ my: 3, borderStyle: 'dashed' }} />
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
				<Typography variant="h6" sx={{ color: 'text.disabled' }}>
					Participants
				</Typography>
				<Box>
					<Button size="small" color={!!errors?.trainees?.message ? "error" : "primary"} startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenParticipants}>
						Add Participants
					</Button>
					{!!errors?.trainees?.message &&
						<FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>{errors.trainees.message}</FormHelperText>
					}
				</Box>
			</Stack>

			<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3} sx={{ paddingX: { xs: 0, md: 8 } }}>
				<TrainingParticipantTable trainees={values.trainees} handleRemove={handleSelectParticipants} />
			</Stack>

			{values.type == "3" && (
				<>
					<Divider sx={{ my: 3, borderStyle: 'dashed' }} />

					<Stack
						spacing={2}
						direction={{ xs: 'column-reverse', md: 'row' }}
						alignItems={{ xs: 'flex-start', md: 'center' }}
					>

						<Stack spacing={2} justifyContent="flex-end" direction={{ xs: 'column', md: 'row' }} sx={{ width: 1 }}>
							<RHFAutocomplete
								name="currency"
								size="small"
								fullWidth
								sx={{ maxWidth: { md: 200 } }}
								options={Object.keys(currencies)}
								onChange={(_, newValue) => {
									console.log(newValue);
									if (newValue) {
										setValue("currency", newValue, { shouldValidate: true, shouldDirty: true });
									} else {
										setValue("currency", '', { shouldValidate: true, shouldDirty: true });
									}
								}}
								renderInput={(params) => <TextField value={values.currency} label="Currency" {...params} />}
							/>

							<RHFTextField

								size="small"
								label="Price"
								name="course_price"
								type="number"
								sx={{ maxWidth: { md: 200 } }}
							/>
						</Stack>
					</Stack>
				</>
			)}

			<DateRangePicker
				variant="calendar"
				startDate={startDate}
				endDate={endDate}
				onChangeStartDate={handleChangeStartDate}
				onChangeEndDate={handleChangeEndDate}
				open={openPicker}
				onClose={handleCloseDate}
				isSelected={isSelectedValuePicker}
				isError={isError}
			/>
			<TrainingEmployeeDialog
				open={openParticipants}
				onClose={handleCloseParticipants}
				selected={(selectedId) => values.trainees.findIndex(tr => tr.emp_id === selectedId) !== -1}
				onSelect={handleSelectParticipants}
				personelOptions={personel}
				trainees={values.trainees}
			/>
		</Box>
	)
}

export default TrainingNewEditDetails