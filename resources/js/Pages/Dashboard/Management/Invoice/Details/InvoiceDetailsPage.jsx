
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
import InvoiceDetails from '@/sections/@dashboard/invoice/details';
import { Head } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage () {
	const { themeStretch } = useSettingsContext();

	// const { id } = useParams();
	const id = "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5";

	const currentInvoice = _invoices.find((invoice) => invoice.id === id);

	return (
		<>
			<Head>
				<title>View</title>
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
