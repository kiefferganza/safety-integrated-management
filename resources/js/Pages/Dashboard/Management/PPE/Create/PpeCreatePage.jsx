// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
const { PpeNewEditForm } = await import('@/sections/@dashboard/ppe/PpeNewEditForm');

// ----------------------------------------------------------------------

export default function PpeCreatePage () {
	const { themeStretch } = useSettingsContext();

	return (
		<Container maxWidth={themeStretch ? false : 'lg'}>
			<CustomBreadcrumbs
				heading="Create a new product"
				links={[
					{ name: 'Dashboard', href: PATH_DASHBOARD.root },
					{
						name: 'PPE',
						href: PATH_DASHBOARD.ppe.root,
					},
					{ name: 'New product' },
				]}
			/>
			<PpeNewEditForm />
		</Container>
	);
}
