
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// _mock_
import { _invoices } from '@/_mock/arrays';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import InvoiceNewEditForm from '@/sections/@dashboard/invoice/form';
import { Head } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function InvoiceEditPage () {
	const { themeStretch } = useSettingsContext();

	// const { id } = useParams();
	const id = "";

	const currentInvoice = _invoices.find((invoice) => invoice.id === id);

	return (
		<>
			<Head>
				<title> Invoice: Edit</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Edit invoice"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Invoices',
							href: PATH_DASHBOARD.invoice.list,
						},
						{ name: `INV-${currentInvoice?.invoiceNumber}` },
					]}
				/>

				<InvoiceNewEditForm isEdit currentInvoice={currentInvoice} />
			</Container>
		</>
	);
}
