import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
const { Card, Grid, Stack, TextField, Typography, InputAdornment, Box } = await import('@mui/material');
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

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
	{ label: 'Box', value: 'Box' },
	{ label: 'Meter', value: 'Meter' },
	{ label: 'Pcs.', value: 'Pcs.' },
	{ label: 'Kgs', value: 'Kgs' },
	{ label: 'Grams', value: 'Grams' },
];


// ----------------------------------------------------------------------

StoreNewEditForm.propTypes = {
	isEdit: PropTypes.bool,
	currentProduct: PropTypes.object,
};

export function StoreNewEditForm ({ isEdit, currentProduct }) {
	const { load, stop } = useSwal();
	const { errors: resErrors } = usePage().props;

	const NewProductSchema = Yup.object().shape({
		name: Yup.string().required('Name is required'),
		description: Yup.string().required('Description is required'),
		qty: Yup.number().test("min", "Must be a positive number.", (val) => {
			return val >= 0;
		}),
		min_qty: Yup.number().moreThan(-1, "Must be a positive number."),
		price: Yup.number(),
		unit: Yup.string().required('Unit is required').oneOf(['Box', 'Meter', 'Pcs.', 'Kgs', 'Grams'], "Please select one of 'Box', 'Meter', 'Pcs.', 'Kgs', 'Grams', unit types.")
	});


	const defaultValues = useMemo(
		() => ({
			name: currentProduct?.name || '',
			description: currentProduct?.description || '',
			images: currentProduct?.images || [],
			qty: currentProduct?.qty || 0,
			min_qty: currentProduct?.min_qty || 0,
			currency: currentProduct?.currency || 'IQD',
			price: currentProduct?.price || 0,
			unit: currentProduct?.unit || TYPE_OPTIONS[2].value,
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
		data.images = data.images.filter(img => (img instanceof File));
		if (isEdit && currentProduct) {
			Inertia.post(route("store.management.update", currentProduct?.id), data, {
				preserveScroll: true,
				onStart () {
					load("Updating product", "please wait...");
				},
				onFinish () {
					stop();
				}
			});
		} else {
			Inertia.post(route("store.management.store"), data, {
				preserveScroll: true,
				onStart () {
					load("Creating product.", "please wait...");
				},
				onFinish () {
					stop();
				}
			});
		}
	};

	const handleDrop = useCallback(
		(acceptedFiles) => {
			const files = values.images || [];

			const newFiles = acceptedFiles.map((file) =>
				Object.assign(file, {
					preview: URL.createObjectURL(file),
				})
			);

			setValue('images', [...files, ...newFiles]);
		},
		[setValue, values.images]
	);

	const handleRemoveFile = (inputFile) => {
		const filtered = values.images && values.images?.filter((file) => file !== inputFile);
		setValue('images', filtered);
	};

	const handleRemoveAllFiles = () => {
		setValue('images', []);
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<Card sx={{ p: 3 }}>
						<Stack spacing={3}>

							<RHFTextField name="name" label="Product Name" />

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
									multiple
									thumbnail
									name="images"
									maxSize={3145728}
									onDrop={handleDrop}
									onRemove={handleRemoveFile}
									onRemoveAll={handleRemoveAllFiles}
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
									name="qty"
									label="Quantity"
									placeholder="0"
									value={getValues('qty') === 0 ? '' : getValues('qty')}
									onChange={(event) => setValue('qty', Number(event.target.value), { shouldValidate: true, shouldDirty: true })}
									InputLabelProps={{ shrink: true }}
									InputProps={{
										type: 'number',
									}}
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
										name="unit"
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
									name="currency"
									fullWidth
									options={[...Object.keys(currencies), ""]}
									onChange={(_, newValue) => {
										if (newValue) {
											setValue("currency", newValue, { shouldValidate: true, shouldDirty: true });
										} else {
											setValue("currency", '', { shouldValidate: true, shouldDirty: true });
										}
									}}
									renderInput={(params) => <TextField value={values.currency} label="Currency" {...params} />}
								/>
								<RHFTextField
									name="price"
									label="Regular Price"
									placeholder="0.00"
									value={getValues('price') === 0 ? '' : getValues('price')}
									onChange={(event) => setValue('price', Number(event.target.value))}
									InputLabelProps={{ shrink: true }}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Box component="span" sx={{ color: 'text.disabled' }}>
													{currencies[getValues("currency")]?.symbol_native}
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
