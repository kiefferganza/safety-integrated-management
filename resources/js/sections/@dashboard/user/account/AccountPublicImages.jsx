import { useCallback, useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
// form
// @mui
import { Stack, Card, Tabs, Tab, Box } from '@mui/material';
// components
import Iconify from '@/Components/iconify';
import AdminNewPublicImage from '../AdminNewPublicImage';
import PublicImageList from '../list/PublicImageList';

// ----------------------------------------------------------------------

export default function AccountPublicImages ({ user, images }) {
	const [currentTab, setCurrentTab] = useState('images');
	console.log(user)

	const TABS = [
		{
			value: 'images',
			label: 'Image List',
			icon: <Iconify icon="ic:sharp-image-search" />,
			component: <PublicImageList images={images} />,
		},
		{
			value: 'new',
			label: 'Upload Image',
			icon: <Iconify icon="mdi:file-image-plus-outline" />,
			component: <AdminNewPublicImage user={user} />,
		}
	];

	return (
		<Card>
			<Tabs
				value={currentTab}
				onChange={(_event, newValue) => setCurrentTab(newValue)}
				sx={{
					px: 2,
					bgcolor: 'background.neutral',
				}}
			>
				{TABS.map((tab) => <Tab key={tab.value} value={tab.value} label={tab.label} icon={tab.icon} />)}
			</Tabs>
			{TABS.map(
				(tab) =>
					tab.value === currentTab && (
						<Box key={tab.value} sx={{ mt: 1, p: 3 }}>
							{tab.component}
						</Box>
					)
			)}
		</Card>
	)
}