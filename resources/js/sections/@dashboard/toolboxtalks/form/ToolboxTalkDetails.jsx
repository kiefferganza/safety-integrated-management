import { useCallback, useState } from 'react';
import ToolboxTalkEmployeeDialog from './ToolboxTalkEmployeeDialog';
import { format } from 'date-fns';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Box, Stack, Divider, Typography, TextField, Autocomplete, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, FormHelperText } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// components
import { RHFSelect, RHFTextField } from '@/Components/hook-form';
import { Upload } from "@/Components/upload";
import useResponsive from '@/hooks/useResponsive';
import Scrollbar from '@/Components/scrollbar';
import Iconify from '@/Components/iconify';
import { usePage } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
	{ type: 1, label: 'Civil' },
	{ type: 2, label: 'Electrical' },
	{ type: 3, label: 'Mechanical' },
	{ type: 4, label: 'Camp' },
	{ type: 5, label: 'Office' },
];

const ToolboxTalkDetails = ({ isEdit, participants, sequences }) => {
	const { auth: { user } } = usePage().props;
	const [openParticipants, setOpenParticipants] = useState(false);
	const isDesktop = useResponsive('up', 'sm');
	const { setValue, watch, clearErrors, formState: { errors } } = useFormContext();
	const values = watch();

	const handleOpenParticipants = () => {
		setOpenParticipants(true);
	};

	const handleCloseParticipants = () => {
		setOpenParticipants(false);
	};

	const handleTypeChange = (e) => {
		setValue("tbt_type", e.target.value, { shoudValidate: true });
		setValue("sequence_no", sequences[e.target.value], { shoudValidate: true })
	}

	const handleChangeDate = (date) => {
		setValue("date_conducted", format(date, 'yyyy-MM-dd 00:00:00'));
		clearErrors("date_conducted");
	}

	const handleChangeTime = (date) => {
		setValue("time_conducted", format(date, 'yyyy-MM-dd HH:mm'));
		clearErrors("time_conducted");
	}

	const getAutocompleteValue = (id) => {
		const p = [...participants, user.employee];
		const findPerson = p.find(per => per.employee_id == id);
		if (findPerson) {
			return `${findPerson.firstname} ${findPerson.lastname}`
		}
		return null;
	}

	const handleDropSingleFile = useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];
		setValue("img_src", Object.assign(file, {
			preview: URL.createObjectURL(file),
		}));
	}, []);

	const handleSelectParticipants = (index) => {
		setValue(`participants.${index}.selected`, !values.participants[index].selected, { shouldValidate: true });
	}

	const handleRemove = (emp_id) => {
		const idx = values.participants.findIndex(p => p.employee_id === emp_id);
		setValue(`participants.${idx}.selected`, false, { shouldValidate: true });
	}

	return (
		<>
			<Box sx={{ p: 3 }}>
				<Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" sx={{ mb: 3 }}>
					<Typography variant="h6" sx={{ color: 'text.disabled', flex: 1 }}>
						Toolbox Talk Details
					</Typography>
					<RHFSelect
						disabled={isEdit}
						size="small"
						name="tbt_type"
						label="TBT Type"
						sx={{ width: { xs: '100%', md: 140 } }}
						onChange={handleTypeChange}
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

							<RHFTextField name="title" label="Title" fullWidth />

							<RHFTextField name="contract_no" label="Contract No." fullWidth />

							<RHFTextField name="location" label="Location" fullWidth />

						</Stack>

						<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
							<Autocomplete
								fullWidth
								value={getAutocompleteValue(values.conducted_by_id)}
								onChange={(_event, newValue) => {
									if (newValue) {
										setValue('conducted_by_id', newValue.id, { shouldValidate: true, shouldDirty: true });
										setValue('conducted_by', newValue.label, { shouldValidate: true, shouldDirty: true });
									} else {
										setValue('conducted_by_id', '', { shouldValidate: true, shouldDirty: true });
										setValue('conducted_by', '', { shouldValidate: true, shouldDirty: true });
									}
								}}
								options={[...participants, user.employee].map((option) => ({ id: option.employee_id, label: `${option?.firstname} ${option?.lastname}` }))}
								renderOption={(props, option) => {
									return (
										<li {...props} key={option.id}>
											{option.label}
										</li>
									);
								}}
								isOptionEqualToValue={(option, value) => option.label === value}
								renderInput={(params) => <TextField label="Conducted By:" {...params} error={!!errors?.conducted_by?.message} helperText={errors?.conducted_by?.message} />}
							/>

							{isDesktop ? (
								<DesktopDatePicker
									label="Date Conducted"
									inputFormat="d-MMM-yyyy"
									value={values?.date_conducted}
									onChange={handleChangeDate}
									disableMaskedInput
									renderInput={(params) =>
										<TextField {...params} readOnly fullWidth error={!!errors?.date_conducted?.message} helperText={errors?.date_conducted?.message} />
									}
								/>
							) : (
								<MobileDatePicker
									label="Date Conducted"
									inputFormat="d-MMM-yyyy"
									value={values?.date_conducted}
									onChange={handleChangeDate}
									renderInput={(params) =>
										<TextField {...params} readOnly fullWidth error={!!errors?.date_conducted?.message} helperText={errors?.date_conducted?.message} />
									}
								/>
							)}

							<TimePicker
								label="Time Conducted"
								value={values?.time_conducted}
								onChange={handleChangeTime}
								renderInput={(params) =>
									<TextField {...params} readOnly fullWidth error={!!errors?.time_conducted?.message} helperText={errors?.time_conducted?.message} />
								}
							/>

						</Stack>

						<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
							<RHFTextField label="Activity" fullWidth multiline name="description" rows={3} />
						</Stack>

						<Divider sx={{ my: 3, borderStyle: 'dashed', width: 1 }} />

						<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3, width: 1 }}>
							<Typography variant="h6" sx={{ color: 'text.disabled' }}>
								Participants
							</Typography>
							<Box>
								<Button size="small" color={!!errors?.participants?.message ? "error" : "primary"} startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenParticipants}>
									Add Participants
								</Button>
								{!!errors?.participants?.message &&
									<FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>{errors.participants.message}</FormHelperText>
								}
							</Box>
						</Stack>

						<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3} sx={{ paddingX: { xs: 0, md: 8 }, width: 1 }}>
							<TableContainer sx={{ overflow: 'unset', mb: 5 }}>
								<Scrollbar>
									<Table sx={{ minWidth: 960 }}>
										<TableHead
											sx={{
												borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
												'& th': { backgroundColor: 'transparent' },
											}}
										>
											<TableRow>
												<TableCell width={40}>#</TableCell>

												<TableCell align="left">Name</TableCell>

												<TableCell align="left">Position</TableCell>

												<TableCell align="center">Hours</TableCell>

												<TableCell align="right"></TableCell>

											</TableRow>
										</TableHead>

										<TableBody>
											{values.participants?.filter(p => p.selected)?.map((row, index) => {
												return (
													<TableRow
														key={index}
														sx={{
															borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
														}}
													>
														<TableCell>{index + 1}</TableCell>

														<TableCell align="left">
															<Box sx={{ maxWidth: 560 }}>
																<Typography variant="subtitle2">{row.fullname}</Typography>

																<Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
																	{row.description}
																</Typography>
															</Box>
														</TableCell>

														<TableCell align="left">{row.position.position}</TableCell>

														<TableCell align="center">
															<RHFTextField
																name={`participants.${values.participants.findIndex(p => p.employee_id === row.employee_id)}.time`}
																size="small"
																type="number"
																sx={{ width: { sm: 1, md: "50%" } }}
															/>
														</TableCell>

														<TableCell align="right">
															<IconButton onClick={() => handleRemove(row.employee_id)}>
																<Iconify icon="eva:trash-2-outline" sx={{ color: 'error.main' }} />
															</IconButton>
														</TableCell>
													</TableRow>
												)
											})}
										</TableBody>
									</Table>
								</Scrollbar>
							</TableContainer>
						</Stack>

						<Divider sx={{ my: 3, borderStyle: 'dashed', width: 1 }} />

						<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
							<Box width={1}>
								<Typography variant="h6" sx={{ color: 'text.disabled' }}>
									Attached File
								</Typography>
								<Upload file={values.img_src} onDrop={handleDropSingleFile} onDelete={() => setValue("img_src", null)} />
							</Box>
						</Stack>

					</Stack>

				</Stack>
			</Box>
			<ToolboxTalkEmployeeDialog
				open={openParticipants}
				onClose={handleCloseParticipants}
				onSelect={handleSelectParticipants}
				participants={values.participants}
			/>
		</>
	)
}

export default ToolboxTalkDetails