import { useCallback, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Box, Stack, Button, Divider, Typography, TextField, Autocomplete, FormHelperText } from '@mui/material';
// components
import { RHFTextField } from '@/Components/hook-form';
import DateRangePicker, { useDateRangePicker } from '@/Components/date-range-picker';
import { Upload } from '@/Components/upload';
import Iconify from '@/Components/iconify';
import TrainingEmployeeDialog from './TrainingEmployeeDialog';
import TrainingParticipantTable from './TrainingParticipantTable';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

const TrainingNewEditDetails = () => {
	const [openParticipants, setOpenParticipants] = useState(false);
	const { personel } = usePage().props;
	const {
		startDate,
		endDate,
		onChangeStartDate,
		onChangeEndDate,
		open: openPicker,
		onOpen: onOpenPicker,
		onClose: onClosePicker,
		isSelected: isSelectedValuePicker,
		isError
	} = useDateRangePicker(null, null);

	const { setValue, watch, formState: { errors } } = useFormContext();

	const values = watch();

	const handleChangeStartDate = (newValue) => {
		onChangeStartDate(newValue);
	};

	const handleChangeEndDate = (newValue) => {
		onChangeEndDate(newValue);
	};

	const handleCloseDate = () => {
		if (!isError && (startDate && endDate)) {
			setValue("date_expired", format(startDate, "yyyy-MM-dd HH:mm:ss"), { shouldValidate: true });
			setValue("training_date", format(endDate, "yyyy-MM-dd HH:mm:ss"), { shouldValidate: true });
		}
		onClosePicker();
	}

	const handleUpload = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];

			const newFile = Object.assign(file, {
				preview: URL.createObjectURL(file),
			});

			if (file) {
				setValue('src', newFile);
			}
		},
		[setValue]);

	const handleRemoveFile = () => {
		setValue('src', null);
	};

	const handleOpenParticipants = () => {
		setOpenParticipants(true);
	};

	const handleCloseParticipants = () => {
		setOpenParticipants(false);
	};

	const handleSelectParticipants = (value) => {
		const isSelected = values.trainees.findIndex(tr => tr?.emp_id === value.employee_id);
		if (isSelected !== -1) {
			setValue("trainees", values.trainees.filter(tr => tr.emp_id !== value.employee_id), { shouldValidate: true });
		} else {
			setValue("trainees", [
				...values.trainees,
				{
					fullname: `${value.firstname} ${value.lastname}`,
					position: value.position,
					emp_id: value.employee_id,
					user_id: value.user_id
				}
			], { shouldValidate: true });
		}
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
						Date Training Range
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
							getOptionLabel={(option) => (`${option?.firstname} ${option?.lastname}`)}
							renderOption={(props, option) => {
								return (
									<li {...props} key={option.employee_id}>
										{`${option?.firstname} ${option?.lastname}`}
									</li>
								);
							}}
							onInputChange={(event) => {
								if (event.type === "change") {
									setValue('trainer', event.target.value, { shouldValidate: true });
								} else {
									setValue('trainer', '', { shouldValidate: true });
								}
							}}
							onChange={(_event, newValue) => {
								if (newValue) {
									setValue('trainer', `${newValue?.firstname} ${newValue?.lastname}`, { shouldValidate: true });
								} else {
									setValue('trainer', '', { shouldValidate: true });
								}
							}}
							renderInput={(params) => <TextField label="Conducted by:" error={!!errors?.trainer?.message} helperText={errors?.trainer?.message || ""} {...params} value={values.trainer} />}
						/>

						<RHFTextField name="contract_no" label="Contract No." type="number" fullWidth />

						<RHFTextField name="training_hrs" label="Training Hours" type="number" fullWidth />

					</Stack>
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

			<Stack spacing={1} mt={3}>

				<Typography variant="h6" sx={{ color: 'text.secondary' }}>
					Attached File
				</Typography>


				<Upload multiple files={values.src ? [values.src] : []} onDrop={handleUpload} onRemove={handleRemoveFile} />
			</Stack>

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
			/>
		</Box>
	)
}

export default TrainingNewEditDetails