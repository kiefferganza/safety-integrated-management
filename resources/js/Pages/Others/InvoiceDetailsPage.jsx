
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// _mock_
import { _invoices } from '@/_mock/arrays';
// components
import { useSettingsContext } from '@/components/settings';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
// sections
import InvoiceDetails from '@/sections/@dashboard/invoice/details';
import { Head } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage () {
	const { themeStretch } = useSettingsContext();

	// const { id } = useParams();
	const id = "";

	const currentInvoice = _invoices.find((invoice) => invoice.id === id);

	return (
		<>
			<Head>
				<title> Invoice: View</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Invoice Details"
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'Invoices',
							href: PATH_DASHBOARD.invoice.root,
						},
						{ name: `INV-${currentInvoice?.invoiceNumber}` },
					]}
				/>

				<InvoiceDetails invoice={currentInvoice} />
			</Container>
		</>
	);
}
