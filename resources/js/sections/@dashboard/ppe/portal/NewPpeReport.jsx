import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Inertia } from "@inertiajs/inertia";
import { fCurrencyNumberAndSymbol } from "@/utils/formatNumber";
import { sentenceCase } from "change-case";
import { useSwal } from "@/hooks/useSwal";
// mui
const { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, Divider, Stack, TextField, Typography, FormHelperText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } = await import("@mui/material");
const { MobileDatePicker } = await import('@mui/x-date-pickers/MobileDatePicker');
// Components
import DateRangePicker, { useDateRangePicker } from '@/Components/date-range-picker';
import { RHFTextField } from "@/Components/hook-form";
import FormProvider from "@/Components/hook-form/FormProvider";
import Scrollbar from "@/Components/scrollbar/Scrollbar";
import Image from "@/Components/image/Image";
import Label from "@/Components/label/Label";

const newBudgetForecastSchema = Yup.object().shape({
	project_code: Yup.string().required('Project Code is required'),
	originator: Yup.string().required('Originator is required'),
	discipline: Yup.string().required('Discipline is required'),
	document_type: Yup.string().required('Project Type is required'),
	location: Yup.string().required('Location is required'),
	contract_no: Yup.string().required("Contract no. is required"),
	conducted_by: Yup.string().required("This field is required"),
	forecast_start_date: Yup.date().nullable().required("Forecast date range is required"),
	forecast_end_date: Yup.date().nullable().required("Forecast date range is required"),
	inventory_date: Yup.date().nullable().required("Inventory date is required"),
	submitted_date: Yup.date().nullable().required("Submitted date is required"),
	submitted_id: Yup.number().nullable().required("Personel is required"),
	reviewer_id: Yup.number().nullable().required("Reviewer personel is required"),
	approval_id: Yup.number().nullable().required("Approval personel is required"),
});

export const NewPpeReport = ({ open, onClose, inventories, employees, sequence_no, ...other }) => {
	const { load, stop } = useSwal();
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
		label,
		onReset
	} = useDateRangePicker(null, null);

	const methods = useForm({
		resolver: yupResolver(newBudgetForecastSchema),
		defaultValues: {
			sequence_no: sequence_no || "",
			project_code: "",
			originator: "",
			discipline: "",
			document_type: "",
			document_zone: "",
			document_level: "",
			inventory_date: null,
			submitted_date: null,
			forecast_start_date: null,
			forecast_end_date: null,
			location: "",
			contract_no: "",
			conducted_by: "",
			submitted_id: null,
			reviewer_id: null,
			approval_id: null,
			remarks: "",
		}
	});

	const { setValue, watch, handleSubmit, reset, formState: { errors } } = methods;

	const values = watch();

	const handleChangeStartDate = (newValue) => {
		setValue("forecast_start_date", newValue, { shouldValidate: true });
		onChangeStartDate(newValue);
	};

	const handleChangeEndDate = (newValue) => {
		setValue("forecast_end_date", newValue, { shouldValidate: true });
		onChangeEndDate(newValue);
	};

	const onSubmit = (data) => {
		Inertia.post(route("ppe.management.report.store"), {
			...data,
			inventories
		}, {
			preserveScroll: true,
			onStart () {
				handleClose();
				load("Adding report to record", "please wait...");
			},
			onFinish () {
				stop();
			}
		});
	}

	const handleClose = () => {
		onClose();
		onReset();
		reset();
	}

	const getAutocompleteValue = (id) => {
		const findPerson = employees.find(per => per.employee_id == id);
		if (findPerson) {
			return findPerson?.fullname;
		}
		return null;
	}

	const options = employees.map((option) => ({ id: option.employee_id, label: option.fullname, user_id: option.user_id }));
	return (
		<Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} {...other}>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>Add Report List</DialogTitle>
				<DialogTitle component="div" sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
					<Button onClick={handleSubmit(onSubmit)} variant="contained">
						Save Report
					</Button>
				</DialogTitle>
			</Stack>
			<DialogContent dividers sx={{ py: 2, border: 'none' }}>
				<FormProvider methods={methods} >
					<Typography variant="h6" sx={{ color: 'text.disabled', flex: 1, mb: 3 }}>
						Project Details
					</Typography>

					<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
						<Stack alignItems="flex-end" spacing={2}>
							<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>

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
							<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>

								<RHFTextField name="document_type" label="Type" />

								<RHFTextField name="document_zone" label="Zone (Optional)" />

								<RHFTextField name="document_level" label="Level (Optional)" />

							</Stack>
							<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>

								<RHFTextField disabled name="sequence_no" label="Squence No." fullWidth />
								<Box width={1} />
								<Box width={1} />

							</Stack>
						</Stack>
					</Stack>

					<Typography variant="h6" sx={{ color: 'text.disabled', flex: 1, my: 3 }}>
						Budget Forecast Details
					</Typography>

					<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
						<Stack alignItems="flex-end" spacing={2}>
							<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>

								<RHFTextField name="contract_no" label="Contract No." fullWidth />

								<RHFTextField name="location" label="Location" fullWidth />

								<RHFTextField name="conducted_by" label="Conducted By" fullWidth />

							</Stack>

							<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>

								<MobileDatePicker
									label="Inventory Date"
									inputFormat="d-MMM-yyyy"
									value={values?.inventory_date}
									onChange={(val) => {
										setValue("inventory_date", val, { shouldValidate: true });
									}}
									renderInput={(params) =>
										<TextField {...params} fullWidth error={!!errors?.inventory_date?.message} helperText={errors?.inventory_date?.message} />
									}
								/>

								<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width={1}>
									<Stack width={1} height={1}>
										<Button
											variant="outlined"
											color={(!!errors?.forecast_start_date?.message || !!errors?.forecast_end_date?.message) ? "error" : "inherit"}
											sx={{
												textTransform: 'unset',
												color: (!!errors?.forecast_start_date?.message || !!errors?.forecast_end_date?.message) ? "text.error" : 'text.secondary',
												justifyContent: 'flex-start',
												fontWeight: 'fontWeightMedium',
												width: 1,
												height: 1
											}}
											onClick={onOpenPicker}
										>
											{isSelectedValuePicker ? label : 'Budget Forecast Date'}
											<Box sx={{ flexGrow: 1 }} />
										</Button>
										{(!!errors?.forecast_start_date?.message || !!errors?.forecast_end_date?.message) && (
											<FormHelperText error sx={{ ml: 1 }}>Forecast date range is required</FormHelperText>
										)}
									</Stack>
									<DateRangePicker
										variant="calendar"
										startDate={startDate}
										endDate={endDate}
										onChangeStartDate={handleChangeStartDate}
										onChangeEndDate={handleChangeEndDate}
										open={openPicker}
										onClose={onClosePicker}
										isSelected={isSelectedValuePicker}
										isError={isError}
									/>
								</Stack>

								<MobileDatePicker
									label="Submitted"
									inputFormat="d-MMM-yyyy"
									value={values?.submitted_date}
									onChange={(val) => {
										setValue("submitted_date", val, { shouldValidate: true });
									}}
									renderInput={(params) =>
										<TextField {...params} fullWidth error={!!errors?.submitted_date?.message} helperText={errors?.submitted_date?.message} />
									}
								/>

							</Stack>

							<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
								<PersonelAutocomplete
									value={getAutocompleteValue(values.submitted_id)}
									onChange={(_event, newValue) => {
										if (newValue) {
											setValue('submitted_id', newValue.id, { shouldValidate: true, shouldDirty: true });
										} else {
											setValue('submitted_id', '', { shouldValidate: true, shouldDirty: true });
										}
									}}
									isOptionEqualToValue={(option, value) => option.label === value}
									options={options}
									label="Submitted By"
									error={errors?.submitted_id?.message}
								/>
								<PersonelAutocomplete
									value={getAutocompleteValue(values.reviewer_id)}
									onChange={(_event, newValue) => {
										if (newValue) {
											setValue('reviewer_id', newValue.id, { shouldValidate: true, shouldDirty: true });
										} else {
											setValue('reviewer_id', '', { shouldValidate: true, shouldDirty: true });
										}
									}}
									isOptionEqualToValue={(option, value) => option.label === value}
									options={options}
									label="Reviewed By"
									error={errors?.reviewer_id?.message}
								/>
								<PersonelAutocomplete
									value={getAutocompleteValue(values.approval_id)}
									onChange={(_event, newValue) => {
										if (newValue) {
											setValue('approval_id', newValue.id, { shouldValidate: true, shouldDirty: true });
										} else {
											setValue('approval_id', '', { shouldValidate: true, shouldDirty: true });
										}
									}}
									isOptionEqualToValue={(option, value) => option.label === value}
									options={options}
									label="Approved By"
									error={errors?.approval_id?.message}
								/>
							</Stack>
							<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
								<RHFTextField label="Remarks (Optional)" fullWidth multiline name="remarks" rows={3} />
							</Stack>
						</Stack>
					</Stack>

					<Typography variant="h6" sx={{ color: 'text.disabled', flex: 1, my: 3 }}>
						Products
					</Typography>

					<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3} sx={{ paddingX: { xs: 0, md: 2 }, width: 1 }}>
						<TableContainer sx={{ overflow: 'unset', mb: 5 }}>
							<Scrollbar>
								<Table sx={{ minWidth: 800 }}>
									<TableHead
										sx={{
											borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
											'& th': { backgroundColor: 'transparent' },
										}}
									>
										<TableRow>
											<TableCell>#</TableCell>

											<TableCell align="left">Product</TableCell>

											<TableCell align="left">Price</TableCell>

											<TableCell align="left">Status</TableCell>
										</TableRow>
									</TableHead>

									<TableBody>
										{inventories.map((inv, idx) => (
											<TableRow
												sx={{
													borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
												}}
												key={inv.inventory_id}
											>
												<TableCell>{idx + 1}</TableCell>

												<TableCell>
													<Stack direction="row" alignItems="center" spacing={2}>
														<Image
															disabledEffect
															visibleByDefault
															alt={inv.item}
															src={inv.img_src ? `/storage/media/photos/inventory/${inv.img_src}` : '/storage/assets/placeholder.svg'}
															sx={{ borderRadius: 1.5, width: 48, height: 48 }}
														/>
														<Typography variant="subtitle2">{inv.item}</Typography>
													</Stack>
												</TableCell>

												<TableCell align="left">
													{fCurrencyNumberAndSymbol(inv.item_price, inv.item_currency)}
												</TableCell>

												<TableCell>
													<Label
														variant="soft"
														color={
															(inv.status === 'out_of_stock' && 'error') || (inv.status === 'low_stock' && 'warning') || 'success'
														}
														sx={{ textTransform: 'capitalize' }}
													>
														{inv.status ? sentenceCase(inv.status) : ''}
													</Label>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</Scrollbar>
						</TableContainer>
					</Stack>

				</FormProvider>
			</DialogContent>
		</Dialog>
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