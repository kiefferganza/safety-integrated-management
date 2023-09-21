// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { capitalCase } from 'change-case';
// sections
const { StoreNewEditForm } = await import('@/sections/@dashboard/operation/store/StoreNewEditForm');

// ----------------------------------------------------------------------

export default function StoreEditPage ({ store }) {
	const { themeStretch } = useSettingsContext();

	return (
		<Container maxWidth={themeStretch ? false : 'lg'}>
			<CustomBreadcrumbs
				heading="Edit Product"
				links={[
					{ name: 'Dashboard', href: PATH_DASHBOARD.root },
					{
						name: 'Store',
						href: PATH_DASHBOARD.store.root,
					},
					{
						name: capitalCase(store.name),
						href: PATH_DASHBOARD.store.show(store.slug),
						enable: true
					},
				]}
			/>
			<StoreNewEditForm currentProduct={store} isEdit />
		</Container>
	);
}
