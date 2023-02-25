import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, TextField, Typography, InputAdornment, Box } from '@mui/material';
//
import { currencies } from '@/_mock/arrays/_currencies';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
import { usePage } from '@inertiajs/inertia-react';
// components
import FormProvider, {
	RHFEditor,
	RHFUpload,
	RHFTextField,
	RHFRadioGroup,
	RHFAutocomplete,
} from '@/Components/hook-form';
import { PATH_DASHBOARD } from '@/routes/paths';

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
	{ label: 'Box', value: 'Box' },
	{ label: 'Meter', value: 'Meter' },
	{ label: 'Pcs.', value: 'Pcs.' },
	{ label: 'Kgs', value: 'Kgs' },
	{ label: 'Grams', value: 'Grams' },
];


// ----------------------------------------------------------------------

PpeNewEditForm.propTypes = {
	isEdit: PropTypes.bool,
	currentProduct: PropTypes.object,
};

export default function PpeNewEditForm ({ isEdit, currentProduct }) {
	const { load, stop } = useSwal();
	const { errors: resErrors } = usePage().props;

	const NewProductSchema = Yup.object().shape({
		item: Yup.string().required('Name is required'),
		description: Yup.string().required('Description is required'),
		current_stock_qty: Yup.number().test("min", "Must be a positive number.", (val) => {
			if (isEdit) return true;
			return val >= 0;
		}),
		min_qty: Yup.number().moreThan(-1, "Must be a positive number."),
		item_price: Yup.number().moreThan(0, 'Price should not be 0'),
	});


	const defaultValues = useMemo(
		() => ({
			item: currentProduct?.item || '',
			description: currentProduct?.description || '',
			img_src: currentProduct?.img_src ? `/storage/media/photos/inventory/${currentProduct?.img_src}` : '',
			current_stock_qty: currentProduct?.current_stock_qty || 0,
			min_qty: currentProduct?.min_qty || 0,
			item_currency: currentProduct?.price || 'USD',
			item_price: currentProduct?.item_price || 0,
			type: currentProduct?.type || TYPE_OPTIONS[2].value,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentProduct]
	);

	const methods = useForm({
		resolver: yupResolver(NewProductSchema),
		defaultValues,
	});

	const {
		reset,
		watch,
		setValue,
		getValues,
		handleSubmit,
		setError,
		formState: { isSubmitting, isDirty },
	} = methods;

	const values = watch();

	useEffect(() => {
		if (Object.keys(resErrors).length !== 0) {
			for (const key in resErrors) {
				setError(key, { type: "custom", message: resErrors[key] });
			}
		} else {
			if (isEdit && currentProduct) {
				reset(defaultValues);
			}
			if (!isEdit) {
				reset(defaultValues);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEdit, currentProduct, resErrors]);

	const onSubmit = async (data) => {
		Inertia.post(!isEdit ? route("ppe.management.store") : PATH_DASHBOARD.ppe.update(currentProduct?.inventory_id), data, {
			preserveScroll: true,
			onStart () {
				load(!isEdit ? "Creating product." : "Updating product", "please wait...");
			},
			onFinish () {
				stop();
			}
		});
	};

	const handleDrop = useCallback(
		(acceptedFiles) => {
			const newFile = Object.assign(acceptedFiles[0], {
				preview: URL.createObjectURL(acceptedFiles[0]),
			})

			setValue('img_src', newFile, { shouldDirty: true });
		},
		[setValue, values.img_src]
	);

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<Card sx={{ p: 3 }}>
						<Stack spacing={3}>
							<RHFTextField name="item" label="Product Name" />

							<Stack spacing={1}>
								<Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
									Description
								</Typography>

								<RHFEditor simple name="description" />
							</Stack>

							<Stack spacing={1}>
								<Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
									Images
								</Typography>

								<RHFUpload
									thumbnail
									name="img_src"
									maxSize={3145728}
									onDrop={handleDrop}
								/>
							</Stack>
						</Stack>
					</Card>
				</Grid>

				<Grid item xs={12} md={4}>
					<Stack spacing={3}>
						<Card sx={{ p: 3 }}>
							<Stack spacing={3} mt={2}>
								<RHFTextField
									name="current_stock_qty"
									label="Quantity"
									placeholder="0"
									value={getValues('current_stock_qty') === 0 ? '' : getValues('current_stock_qty')}
									onChange={(event) => setValue('current_stock_qty', Number(event.target.value), { shouldValidate: true, shouldDirty: true })}
									InputLabelProps={{ shrink: true }}
									InputProps={{
										type: 'number',
									}}
									disabled={isEdit}
								/>

								<RHFTextField
									name="min_qty"
									label="Minimum Quantity"
									placeholder="0"
									value={getValues('min_qty') === 0 ? '' : getValues('min_qty')}
									onChange={(event) => setValue('min_qty', Number(event.target.value), { shouldValidate: true, shouldDirty: true })}
									InputLabelProps={{ shrink: true }}
									InputProps={{
										type: 'number',
									}}
								/>

								<Stack spacing={1}>
									<Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
										Unit
									</Typography>

									<RHFRadioGroup
										name="type"
										options={TYPE_OPTIONS}
										sx={{
											'& .MuiFormControlLabel-root': { mr: 4 },
										}}
									/>
								</Stack>
							</Stack>
						</Card>

						<Card sx={{ p: 3 }}>
							<Stack spacing={3} mb={2}>
								<RHFAutocomplete
									name="item_currency"
									fullWidth
									options={[...Object.keys(currencies), ""]}
									onChange={(_, newValue) => {
										if (newValue) {
											setValue("item_currency", newValue, { shouldValidate: true, shouldDirty: true });
										} else {
											setValue("item_currency", '', { shouldValidate: true, shouldDirty: true });
										}
									}}
									renderInput={(params) => <TextField value={values.currency} label="Currency" {...params} />}
								/>
								<RHFTextField
									name="item_price"
									label="Regular Price"
									placeholder="0.00"
									value={getValues('item_price') === 0 ? '' : getValues('item_price')}
									onChange={(event) => setValue('item_price', Number(event.target.value))}
									InputLabelProps={{ shrink: true }}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Box component="span" sx={{ color: 'text.disabled' }}>
													{currencies[getValues("item_currency")]?.symbol_native}
												</Box>
											</InputAdornment>
										),
										type: 'number',
									}}
								/>
							</Stack>
						</Card>

						<LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting} disabled={isEdit ? !isDirty : false}>
							{!isEdit ? 'Create Product' : 'Save Changes'}
						</LoadingButton>
					</Stack>
				</Grid>
			</Grid>
		</FormProvider>
	);
}
