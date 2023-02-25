// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import { Head } from '@inertiajs/inertia-react';
const { PpeNewEditForm } = await import('@/sections/@dashboard/ppe/PpeNewEditForm');

// ----------------------------------------------------------------------

export default function PpeEditPage ({ inventory }) {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>Edit Product</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Edit Product"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'PPE',
							href: PATH_DASHBOARD.ppe.root,
						},
						{
							name: inventory?.item?.toUpperCase(),
							href: PATH_DASHBOARD.ppe.view(inventory.slug),
							enable: true
						},
					]}
				/>
				<PpeNewEditForm currentProduct={inventory} isEdit />
			</Container>
		</>
	);
}
