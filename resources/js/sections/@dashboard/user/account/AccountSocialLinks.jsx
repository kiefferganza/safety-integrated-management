import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '@/Components/iconify';
import FormProvider, { RHFTextField } from '@/Components/hook-form';
import { Inertia } from '@inertiajs/inertia';

// ----------------------------------------------------------------------

const SOCIAL_LINKS = [
	{
		value: 'facebook',
		icon: <Iconify icon="eva:facebook-fill" width={24} />,
		placeholder: "Link to your facebook account"
	},
	{
		value: 'instagram',
		icon: <Iconify icon="ant-design:instagram-filled" width={24} />,
		placeholder: "Link to your instagram account"
	},
	{
		value: 'linkedin',
		icon: <Iconify icon="eva:linkedin-fill" width={24} />,
		placeholder: "Link to your linkedin account"
	},
	{
		value: 'twitter',
		icon: <Iconify icon="eva:twitter-fill" width={24} />,
		placeholder: "Link to your twitter account"
	},
];

// ----------------------------------------------------------------------
export default function AccountSocialLinks ({ user }) {
	const [loading, setLoading] = useState(false);

	function getSocial (type) {
		if (user?.social_accounts?.length > 0) {
			return user?.social_accounts?.find(social => social?.type === type)?.social_link
		}
		return null;
	}

	const defaultValues = {
		facebook: getSocial("facebook") || '',
		instagram: getSocial("instagram") || '',
		linkedin: getSocial("linkedin") || '',
		twitter: getSocial("twitter") || '',
	};

	const methods = useForm({
		defaultValues,
	});

	const {
		handleSubmit,
		formState: {
			isDirty
		}
	} = methods;

	const onSubmit = async (data) => {
		try {
			Inertia.put(route('management.user.update_socials'), data, {
				preserveScroll: true,
				preserveState: true,
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

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Card sx={{ p: 3 }}>
				<Stack spacing={3} alignItems="flex-end">
					{SOCIAL_LINKS.map((link) => (
						<RHFTextField
							key={link.value}
							name={link.value}
							placeholder={link.placeholder}
							InputProps={{
								startAdornment: <InputAdornment position="start">{link.icon}</InputAdornment>,
							}}
						/>
					))}

					<LoadingButton type="submit" variant="contained" disabled={!isDirty} loading={loading}>
						Save Changes
					</LoadingButton>
				</Stack>
			</Card>
		</FormProvider>
	);
}
