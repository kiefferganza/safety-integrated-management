
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/components/settings';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
// sections
import InvoiceNewEditForm from '@/sections/@dashboard/invoice/form';
import { Head } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function InvoiceCreatePage () {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title> Invoices: Create a new invoice | Minimal UI</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Create a new invoice"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Invoices',
							href: PATH_DASHBOARD.invoice.list,
						},
						{
							name: 'New invoice',
						},
					]}
				/>

				<InvoiceNewEditForm />
			</Container>
		</>
	);
}
