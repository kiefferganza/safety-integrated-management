import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import { Upload } from '@/Components/upload';
import FormProvider from '@/Components/hook-form';

// ----------------------------------------------------------------------

const AdminNewPublicImage = () => {
	const { errors: resErrors } = usePage().props;
	const [loading, setLoading] = useState(false);

	const ChangePassWordSchema = Yup.object().shape({
		images: Yup.array().min(1, "Please upload at least one image.").of(Yup.mixed().test("type", "Only the following formats are accepted: .jpeg, .jpg, .pdf and .webp", (value) => {
			return value && (
				value.type === "image/jpeg" ||
				value.type === "image/webp" ||
				value.type === "image/png"
			);
		}))
	});

	const defaultValues = {
		images: []
	};

	const methods = useForm({
		resolver: yupResolver(ChangePassWordSchema),
		defaultValues,
	});

	const {
		handleSubmit,
		setError,
		setValue,
		watch,
		reset,
		formState: { errors }
	} = methods;

	const images = watch("images");
	const handleDropMultiFile = useCallback(
		(acceptedFiles) => {
			const newFiles = acceptedFiles.map((file) =>
				Object.assign(file, {
					preview: URL.createObjectURL(file),
				})
			);

			setValue("images", [...images, ...newFiles], { shouldValidate: true });
		},
		[images]
	);

	const handleRemoveFile = (inputFile) => {
		const filtered = images.filter((image) => image !== inputFile);
		setValue("images", filtered, { shouldValidate: true });
	};

	const handleRemoveAllFiles = () => {
		setValue("images", [], { shouldValidate: true });
	};

	useEffect(() => {
		if (Object.keys(resErrors).length !== 0) {
			for (const key in resErrors) {
				setError(key, { type: "custom", message: resErrors[key] });
			}
		}
	}, [resErrors]);

	const onSubmit = async (data) => {
		Inertia.post(route("image.storeSlider"), data, {
			preserveScroll: true,
			preserveState: true,
			onStart () {
				setLoading(true);
			},
			onFinish () {
				setLoading(false);
				reset();
			}
		});
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3} alignItems="flex-end">
				<Upload
					multiple
					thumbnail
					files={images}
					onDrop={handleDropMultiFile}
					onRemove={handleRemoveFile}
					onRemoveAll={handleRemoveAllFiles}
					error={!!errors?.images?.message}
					helperText={errors?.images?.message}
					accept={{
						'image/jpeg': [],
						'image/png': [],
						'image/webp': [],
					}}
				/>

				<LoadingButton type="submit" variant="contained" loading={loading}>
					Save Changes
				</LoadingButton>
			</Stack>
		</FormProvider>
	)
}

export default AdminNewPublicImage