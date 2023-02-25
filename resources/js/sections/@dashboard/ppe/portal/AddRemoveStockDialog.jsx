// form
import { usePage } from "@inertiajs/inertia-react";
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
// mui
import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
// Components
import { RHFRadioGroup, RHFTextField } from "@/Components/hook-form";
import Image from "@/Components/image";
import FormProvider from "@/Components/hook-form/FormProvider";
import { Inertia } from "@inertiajs/inertia";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useSwal } from "@/hooks/useSwal";

export const AddRemoveStockDialog = ({ open, onClose, type = "add", inventory, ...other }) => {
	const { load, stop } = useSwal();
	const { employee, auth: { user } } = usePage().props;

	const newStockSchema = Yup.object().shape({
		qty: Yup.number()
			.min(1, 'Please provide a valid quantity number.')
			.test('qty_max', 'Must be less than or equal to the current quantity.', (val) => {
				if (type === "add") return true;
				return val <= +inventory?.current_stock_qty
			}),
		rqstType: Yup.string().nullable(),
		employee_id: Yup.string().nullable().when("rqstType", (rqstType, schema) => {
			return (rqstType === "employee" && type === "remove") ? schema.required("Please select an employee.") : schema.notRequired()
		}),
		location: Yup.string().when("rqstType", (rqstType, schema) => {
			return (rqstType === "location" && type === "remove") ? schema.required("Please enter a location") : schema.notRequired()
		}),
	});

	const methods = useForm({
		resolver: yupResolver(newStockSchema),
		defaultValues: {
			qty: 0,
			rqstType: type === "add" ? null : "employee",
			employee_id: null,
			location: ""
		}
	});
	const { setValue, getValues, watch, handleSubmit, reset, formState: { errors } } = methods;

	const values = watch();

	const onSubmit = (data) => {
		data.type = type;
		data.location = data.location || null;
		Inertia.post(PATH_DASHBOARD.ppe.addRemoveStock(inventory.inventory_id), data, {
			preserveScroll: true,
			onStart () {
				handleClose();
				load("Re-stocking", "please wait...");
			},
			onFinish () {
				stop();
			}
		});
	}

	const getAutocompleteValue = (id) => {
		if (id) {
			const findPerson = employee.find(per => per.employee_id == id);
			if (findPerson) {
				return findPerson?.fullname;
			}
		}
		return null;
	}
	const options = employee.map((option) => ({ id: option.employee_id, label: option.fullname, user_id: option.user_id }));

	const handleClose = () => {
		onClose();
		reset();
	}

	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} {...other}>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{inventory?.item}</DialogTitle>
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
					Quantity After Update: {type === "add" ? +inventory?.current_stock_qty + getValues("qty") : +inventory?.current_stock_qty - getValues("qty")}
				</DialogTitle>
			</Stack>
			<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={4}>
						<Image
							disabledEffect
							visibleByDefault
							alt={inventory?.item}
							src={inventory?.img_src ? `/storage/media/photos/inventory/${inventory.img_src}` : '/storage/assets/placeholder.svg'}
							sx={{ borderRadius: 1.5, width: 62, height: 62, margin: 'auto' }}
						/>
					</Grid>
					<Grid item xs={12} md={8}>
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Stack width={1}>
								<Typography variant="subtitle2">Product Name</Typography>
								<Typography variant="subtitle2" sx={{ textTransform: "capitalize", color: 'text.secondary' }}>{inventory?.item}</Typography>
							</Stack>
							<Stack width={1}>
								<Typography variant="subtitle2" textAlign="center">Quantity</Typography>
								<Typography variant="subtitle2" sx={{ color: 'text.secondary' }} textAlign="center">{inventory?.current_stock_qty}</Typography>
							</Stack>
						</Stack>
					</Grid>
				</Grid>
				<Divider sx={{ borderStyle: 'dashed', my: 3 }} />
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={2}>
						<RHFTextField
							name="qty"
							label="Quantity"
							placeholder="0"
							size="small"
							value={getValues('qty') === 0 ? '' : getValues('qty')}
							onChange={(event) => setValue('qty', Number(event.target.value), { shouldValidate: true })}
							sx={{ maxWidth: 220 }}
							InputLabelProps={{ shrink: true }}
							InputProps={{
								type: 'number',
							}}
						/>
						<Stack>
							<Typography variant="subtitle2">Requested By</Typography>
							{type === "add" && (
								<Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{user?.employee?.fullname}</Typography>
							)}
							{type === "remove" && (
								<>
									<RHFRadioGroup
										name="rqstType"
										options={[
											{ label: "Employee", value: "employee" },
											{ label: "Location", value: "location" }
										]}
										onChange={(event) => {
											setValue("location", "");
											setValue("employee_id", null);
											setValue("rqstType", event.target.value);
										}}
										sx={{
											'& .MuiFormControlLabel-root': { mr: 4 },
										}}
									/>
									{getValues("rqstType") === "employee" ? (
										<PersonelAutocomplete
											value={getAutocompleteValue(values.employee_id)}
											onChange={(_event, newValue) => {
												if (newValue) {
													setValue('employee_id', newValue.id, { shouldValidate: true, shouldDirty: true });
												} else {
													setValue('employee_id', '', { shouldValidate: true, shouldDirty: true });
												}
											}}
											isOptionEqualToValue={(option, value) => option.label === value}
											options={options}
											label="Employee"
											error={errors?.employee_id?.message}
										/>
									) : (
										<RHFTextField
											name="location"
											label="Location"
											size="small"
											sx={{ maxWidth: 280 }}
										/>
									)}
								</>
							)}
						</Stack>
					</Stack>
					<Divider sx={{ borderStyle: 'dashed', my: 1 }} />
					<Stack direction="row" justifyContent="end">
						<Button type="submit" variant="contained" sx={{ mb: 2 }}>
							{type === "add" ? "Add Stock" : "Remove Stock"}
						</Button>
					</Stack>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

function PersonelAutocomplete ({ value, onChange, options, label, error = "", ...others }) {
	return (
		<Autocomplete
			// fullWidth
			size="small"
			sx={{ my: 1, maxWidth: 280 }}
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