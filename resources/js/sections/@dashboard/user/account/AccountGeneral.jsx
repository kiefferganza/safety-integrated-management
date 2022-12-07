import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import { fData } from '@/utils/formatNumber';
// components
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFPhone } from '@/Components/hook-form';
import Label from '@/Components/label';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function AccountGeneral ({ user }) {
	const { errors: resErrors } = usePage().props;
	const [loading, setLoading] = useState(false);
	const UpdateUserSchema = Yup.object().shape({
		firstname: Yup.string().required('First name must not be empty'),
		lastname: Yup.string().required('Last name must not be empty'),
		email: Yup.string().required('Email must not be empty').email(),
		username: Yup.string().required('Username must not be empty'),
		about: Yup.string().max(255, "About must not exceed 255 characters")
	});

	const defaultValues = {
		firstname: user?.firstname || user?.employee?.firstname || '',
		lastname: user?.lastname || user?.employee?.lastname || '',
		email: user?.email || '',
		profile_pic: user?.profile_pic ? `/storage/media/photos/employee/${user?.profile_pic}` : null,
		username: user?.username || '',
		about: user?.about || '',
		// isPublic: user?.isPublic || false,
	};

	const methods = useForm({
		resolver: yupResolver(UpdateUserSchema),
		defaultValues,
	});

	let {
		setValue,
		handleSubmit,
		setError,
		formState: { isDirty },
	} = methods;

	useEffect(() => {
		if (Object.keys(resErrors).length !== 0) {
			for (const key in resErrors) {
				setError(key, { type: "custom", message: resErrors[key] });
			}
		}
	}, [resErrors]);

	const onSubmit = async (data) => {
		try {
			Inertia.put(`/dashboard/user/${user.user_id}/update`, data, {
				preserveScroll: true,
				onStart () {
					setLoading(true);
				},
				onFinish () {
					setLoading(false);
				}
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handleDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];

			const newFile = Object.assign(file, {
				preview: URL.createObjectURL(file),
			});

			if (file) {
				setValue('profile_pic', newFile, { shouldDirty: true });
			}
		},
		[setValue]
	);

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={4}>
					<Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
						<Label
							color={user?.user_type === 1 ? 'info' : 'success'}
							sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
						>
							{user?.user_type === 1 ? "User" : "Admin"}
						</Label>
						<Box sx={{ mb: 5 }}>

							<RHFUploadAvatar
								name="profile_pic"
								maxSize={3145728}
								onDrop={handleDrop}
								helperText={
									<Typography
										variant="caption"
										sx={{
											mt: 2,
											mx: 'auto',
											display: 'block',
											textAlign: 'center',
											color: 'text.secondary',
										}}
									>
										Allowed *.jpeg, *.jpg, *.png, *.gif
										<br /> max size of {fData(3145728)}
									</Typography>
								}
							/>
						</Box>

						{/* <RHFSwitch name="isPublic" labelPlacement="start" label="Public Profile" sx={{ mt: 5 }} /> */}
					</Card>
				</Grid>

				<Grid item xs={12} md={8}>
					<Card sx={{ p: 3 }}>
						<Box
							rowGap={3}
							columnGap={2}
							display="grid"
							gridTemplateColumns={{
								xs: 'repeat(1, 1fr)',
								sm: 'repeat(2, 1fr)',
							}}
						>
							<RHFTextField name="firstname" label="First name" />

							<RHFTextField name="lastname" label="Last name" />

							<RHFTextField name="email" label="Email Address" />

							<RHFPhone name="username" label="Username" />

						</Box>

						<Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
							<RHFTextField name="about" multiline rows={4} label="About" />

							<LoadingButton type="submit" variant="contained" disabled={!isDirty} loading={loading}>
								Save Changes
							</LoadingButton>
						</Stack>
					</Card>
				</Grid>
			</Grid>
		</FormProvider>
	);
}
