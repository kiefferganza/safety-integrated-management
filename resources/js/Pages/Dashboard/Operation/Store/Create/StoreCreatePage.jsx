// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
const { StoreNewEditForm } = await import('@/sections/@dashboard/operation/store/StoreNewEditForm');

// ----------------------------------------------------------------------

export default function StoreCreatePage () {
	const { themeStretch } = useSettingsContext();

	return (
		<Container maxWidth={themeStretch ? false : 'lg'}>
			<CustomBreadcrumbs
				heading="Create a new product"
				links={[
					{ name: 'Dashboard', href: PATH_DASHBOARD.root },
					{
						name: 'Store',
						href: PATH_DASHBOARD.store.root,
					},
					{ name: 'New product' },
				]}
			/>
			<StoreNewEditForm />
		</Container>
	);
}
