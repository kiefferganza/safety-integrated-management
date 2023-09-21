import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Inertia } from "@inertiajs/inertia";
import { fCurrencyNumberAndSymbol, fNumber } from "@/utils/formatNumber";
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
import Iconify from "@/Components/iconify/Iconify";
import { format } from "date-fns";

const newBudgetForecastSchema = Yup.object().shape({
	project_code: Yup.string().required('Project Code is required'),
	originator: Yup.string().required('Originator is required'),
	discipline: Yup.string().required('Discipline is required'),
	document_type: Yup.string().required('Project Type is required'),
	location: Yup.string().required('Location is required'),
	contract_no: Yup.string().required("Contract no. is required"),
	conducted_by: Yup.string().required("This field is required"),
	inventory_start_date: Yup.date().nullable().required("Inventory date range is required"),
	inventory_end_date: Yup.date().nullable().required("Inventory date range is required"),
	budget_forcast_date: Yup.date().nullable().required("Forcast date is required"),
	submitted_date: Yup.date().nullable().required("Submitted date is required"),
	reviewer_id: Yup.number().nullable().required("Reviewer personel is required"),
	approver_id: Yup.number().nullable().required("Approver personel is required"),
	remarks: Yup.string().max(255),
	items: Yup.array().min(1)
});

export const NewStoreReport = ({ open, onClose, stores, employees, sequence_no, submittedDates, ...other }) => {
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

	const defaultValues = {
		sequence_no: sequence_no || "",
		project_code: "",
		originator: "",
		discipline: "",
		document_type: "",
		document_zone: "",
		document_level: "",
		budget_forcast_date: null,
		submitted_date: null,
		inventory_start_date: null,
		inventory_end_date: null,
		location: "",
		contract_no: "",
		conducted_by: "",
		reviewer_id: null,
		approver_id: null,
		remarks: "",
		items: stores.map(inv => ({
			...inv,
			minOrder: inv.min_qty,
			order: 0,
			baseNum: 10,
			inventoryStatus: inv.status
		}))
	};

	const methods = useForm({
		resolver: yupResolver(newBudgetForecastSchema),
		defaultValues
	});

	const { setValue, watch, handleSubmit, reset, formState: { errors } } = methods;

	const values = watch();

	useEffect(() => {
		if (stores?.length > 0) {
			reset(defaultValues);
		}
	}, [stores])

	const handleChangeStartDate = (newValue) => {
		setValue("inventory_start_date", newValue, { shouldValidate: true });
		onChangeStartDate(newValue);
	};

	const handleChangeEndDate = (newValue) => {
		setValue("inventory_end_date", newValue, { shouldValidate: true });
		onChangeEndDate(newValue);
	};

	const onSubmit = (data) => {
		data.inventory_start_date = format(data.inventory_start_date, 'yyyy/MM/dd');
		data.inventory_end_date = format(data.inventory_end_date, 'yyyy/MM/dd');
		data.budget_forcast_date = format(data.budget_forcast_date, 'yyyy/MM/dd');
		data.submitted_date = format(data.submitted_date, 'yyyy/MM/dd');
		Inertia.post(route("operation.store.report.store"), data, {
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

	const handleBaseNumChange = (idx, val) => {
		setValue(`items.${idx}.baseNum`, val);
	}

	const handleMaxOrderChange = (idx, val) => {
		setValue(`items.${idx}.order`, val);
		const inventory = values.items[idx];
		const newStatus = getStatus((inventory.qty + inventory.order), inventory.min_qty);
		if (newStatus !== inventory.inventoryStatus) {
			setValue(`items.${idx}.inventoryStatus`, newStatus);
		}
	}


	const disableSubmittedDates = (date) => {
		return submittedDates.some((submittedDate) => (new Date(submittedDate).toDateString() === date.toDateString()))
	}


	const options = employees.map((option) => ({ id: option.employee_id, label: option.fullname, user_id: option.user_id }));
	return (
		<Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose} {...other}>
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

								<PersonelAutocomplete
									value={employees.find(per => per.employee_id == values.conducted_by)?.fullname}
									onChange={(_event, newValue) => {
										if (newValue) {
											setValue('conducted_by', newValue.label, { shouldValidate: true, shouldDirty: true });
										} else {
											setValue('conducted_by', '', { shouldValidate: true, shouldDirty: true });
										}
									}}
									isOptionEqualToValue={(option, value) => option.label === value.label}
									options={options}
									label="Conducted By"
									error={errors?.conducted_by?.message}
								/>

							</Stack>

							<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
								<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width={1}>
									<Stack width={1} height={1}>
										<Button
											variant="outlined"
											color={(!!errors?.inventory_start_date?.message || !!errors?.inventory_end_date?.message) ? "error" : "inherit"}
											sx={{
												textTransform: 'unset',
												color: (!!errors?.inventory_start_date?.message || !!errors?.inventory_end_date?.message) ? "text.error" : 'text.secondary',
												justifyContent: 'flex-start',
												fontWeight: 'fontWeightMedium',
												width: 1,
												height: 1
											}}
											onClick={onOpenPicker}
										>
											{isSelectedValuePicker ? label : 'Inventory Date Range'}
											<Box sx={{ flexGrow: 1 }} />
										</Button>
										{(!!errors?.inventory_start_date?.message || !!errors?.inventory_end_date?.message) && (
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
									label="Budget Forecast Date"
									inputFormat="MMM-yyyy"
									openTo={"year"}
									views={["year", "month"]}
									value={values?.budget_forcast_date}
									onChange={(val) => {
										setValue("budget_forcast_date", val, { shouldValidate: true });
									}}
									renderInput={(params) =>
										<TextField {...params} fullWidth error={!!errors?.budget_forcast_date?.message} helperText={errors?.budget_forcast_date?.message} />
									}
								/>

								<MobileDatePicker
									label="Submitted Date"
									inputFormat="d-MMM-yyyy"
									shouldDisableDate={disableSubmittedDates}
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
									value={getAutocompleteValue(values.reviewer_id)}
									onChange={(_event, newValue) => {
										if (newValue) {
											setValue('reviewer_id', newValue.id, { shouldValidate: true, shouldDirty: true });
										} else {
											setValue('reviewer_id', null, { shouldValidate: true, shouldDirty: true });
										}
									}}
									isOptionEqualToValue={(option, value) => option.label === value}
									options={options}
									label="Reviewed By"
									error={errors?.reviewer_id?.message}
								/>
								<PersonelAutocomplete
									value={getAutocompleteValue(values.approver_id)}
									onChange={(_event, newValue) => {
										if (newValue) {
											setValue('approver_id', newValue.id, { shouldValidate: true, shouldDirty: true });
										} else {
											setValue('approver_id', null, { shouldValidate: true, shouldDirty: true });
										}
									}}
									isOptionEqualToValue={(option, value) => option.label === value}
									options={options}
									label="Approved By"
									error={errors?.approver_id?.message}
								/>
								<Box width={1} />
							</Stack>
							<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
								<RHFTextField label="Remarks (Optional)" fullWidth multiline name="remarks" rows={3} />
							</Stack>
						</Stack>
					</Stack>

					<Typography variant="h6" sx={{ color: 'text.disabled', flex: 1, my: 3 }}>
						Products
					</Typography>

					<NewProductList
						stores={values.items}
						handleBaseNumChange={handleBaseNumChange}
						handleMaxOrderChange={handleMaxOrderChange}
					/>

				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}


function NewProductList ({ stores, handleBaseNumChange, handleMaxOrderChange }) {

	return (
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

								<TableCell align="left">Remaining Quantity</TableCell>

								<TableCell align="left">Min Order</TableCell>

								<TableCell align="center">Order</TableCell>

								<TableCell align="left">Status</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{stores.map((inv, idx) => (
								<TableRow
									sx={{
										borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
									}}
									key={inv.id}
								>
									<TableCell>{idx + 1}</TableCell>

									<TableCell>
										<Stack direction="row" alignItems="center" spacing={2}>
											<Image
												disabledEffect
												visibleByDefault
												alt={inv.name}
												src={inv.thumbnail}
												sx={{ borderRadius: 1.5, width: 48, height: 48 }}
											/>
											<Typography variant="subtitle2">{inv.item}</Typography>
										</Stack>
									</TableCell>

									<TableCell align="left">
										{fCurrencyNumberAndSymbol(inv.price, inv.currency)}
									</TableCell>

									<TableCell align="left">
										{fNumber(inv.qty)}
									</TableCell>

									<TableCell align="left">
										{(inv?.minOrder || 0).toLocaleString()}
									</TableCell>

									<TableCell align="left">
										<Stack spacing={1} direction="row" alignItems="center" justifyContent="center">
											<span>{inv.order}</span>
											<Iconify
												icon="ic:baseline-minus"
												width={14}
												sx={{ cursor: "pointer" }}
												onClick={() => handleMaxOrderChange(idx, inv.order - inv.baseNum)}
											/>
											<Stack alignItems="center">
												<Iconify
													icon="ic:baseline-arrow-drop-up"
													sx={{ cursor: "pointer" }}
													onClick={() => handleBaseNumChange(idx, inv.baseNum + 1)}
												/>
												<span>{inv.baseNum}</span>
												<Iconify
													icon="ic:baseline-arrow-drop-down"
													sx={{ cursor: "pointer" }}
													onClick={() => handleBaseNumChange(idx, inv.baseNum - 1)}
												/>
											</Stack>
											<Iconify icon="material-symbols:add"
												width={14}
												sx={{ cursor: "pointer" }}
												onClick={() => handleMaxOrderChange(idx, inv.order + inv.baseNum)}
											/>
										</Stack>
									</TableCell>

									<TableCell>
										<Label
											variant="soft"
											color={
												(inv.inventoryStatus === 'out_of_stock' && 'error') || (inv.inventoryStatus === 'low_stock' && 'warning') || 'success'
											}
											sx={{ textTransform: 'capitalize' }}
										>
											{ }
											{inv.inventoryStatus ? sentenceCase(inv.inventoryStatus) : ''}
										</Label>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Scrollbar>
			</TableContainer>
		</Stack>
	)
}

function getStatus (qty, minQty) {
	if (qty <= 0) return "out_of_stock";
	if (qty < minQty) return "low_stock";
	const lowStockThreshold = minQty + 5;
	if (qty >= minQty && qty < lowStockThreshold) return "need_reorder";
	return "in_stock";
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