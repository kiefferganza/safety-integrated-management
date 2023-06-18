import { useState } from 'react';
import { Backdrop, CircularProgress, Stack } from '@mui/material';
import Images from './gallery/Images';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { useQueryClient } from '@tanstack/react-query';
// import axiosInstance from '@/utils/axios';

export default function ProfileGallery ({ user }) {
	const queryClient = useQueryClient();
	const [openBackdrop, setOpenBackdrop] = useState(false);
	const { auth } = usePage().props;

	const handleDeleteProfile = async (id, queryKey) => {
		// const res = await axiosInstance.delete(route("api.images.delete-image", id))
		// console.log(res);
		Inertia.delete(route("api.images.delete-image", id), {
			preserveScroll: true,
			onStart () {
				setOpenBackdrop(true);
			},
			onFinish () {
				queryClient.invalidateQueries({
					queryKey,
					force: true
				})
				setOpenBackdrop(false);
			}
		});
	}

	const setProfile = (id) => {
		Inertia.post(route('management.user.change-profile', user.user_id), { mediaId: id }, {
			preserveScroll: true,
			onStart () {
				setOpenBackdrop(true);
			},
			onFinish () {
				setOpenBackdrop(false)
			}
		})
	}

	return (
		<>
			<Stack>
				<Images
					name='api.user.profile_images'
					queryKey={['user.profile_images', user.user_id]}
					params={{
						user: user.user_id
					}}
					title='Profile'
					onDelete={(id) => handleDeleteProfile(id)}
					canDelete={auth.user.user_id === user.user_id}
					actionName="Set Profile"
					actionFn={(id) => setProfile(id)}
				/>
				<Images
					name='api.user.cover_images'
					queryKey={['user.cover_images', user.user_id]}
					params={{
						user: user.user_id
					}}
					title='Cover Photos'
					onDelete={(id) => handleDeleteProfile(id)}
					canDelete={auth.user.user_id === user.user_id}
					actionName="Set Profile"
					actionFn={(id) => setProfile(id)}
				/>
			</Stack>
			<Backdrop open={openBackdrop}>
				<CircularProgress />
			</Backdrop>
		</>
	)
}

