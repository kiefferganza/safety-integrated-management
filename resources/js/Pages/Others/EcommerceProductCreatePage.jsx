// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import ProductNewEditForm from '@/sections/@dashboard/e-commerce/ProductNewEditForm';
import { Head } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function EcommerceProductCreatePage () {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title> Ecommerce: Create a new product</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Create a new product"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'E-Commerce',
							href: PATH_DASHBOARD.eCommerce.root,
						},
						{ name: 'New product' },
					]}
				/>
				<ProductNewEditForm />
			</Container>
		</>
	);
}
