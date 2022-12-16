import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
// sections
import InvoiceDetails from '@/sections/@dashboard/invoice/details';
import { Head } from '@inertiajs/inertia-react';
import { PATH_DASHBOARD } from "@/routes/paths";

import { _invoices } from '@/_mock/arrays';

const index = ({ training }) => {
	const { themeStretch } = useSettingsContext();
	const [trainingData, setTrainingData] = useState({});

	const joinTrainees = () => {
		const newTrainees = training.trainees.map(tr => {
			const file = training.training_files.find(f => f.training_id === tr.pivot.training_id && f.emp_id === tr.employee_id);
			return {
				...tr,
				emp_id: tr.employee_id,
				fullname: `${tr.firstname} ${tr.lastname}`,
				position: tr?.position?.position,
				src: file ? `/storage/media/training/${file.src}` : null
			};
		});
		return newTrainees;
	}

	useEffect(() => {
		if (training) {
			setTrainingData({
				...training,
				trainees: joinTrainees(),
			});
		}
	}, []);

	const id = "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5";

	const currentInvoice = _invoices.find((invoice) => invoice.id === id);

	return (
		<>
			<Head>
				<title>Client</title>
			</Head>
			<DashboardLayout>
				<Container maxWidth={themeStretch ? false : 'lg'}>
					<CustomBreadcrumbs
						heading="Invoice Details"
						links={[
							{ name: 'Dashboard', href: PATH_DASHBOARD.root },
							{
								name: 'Invoices',
								href: PATH_DASHBOARD.training.root,
							},
							{ name: `Client` },
						]}
					/>

					<InvoiceDetails invoice={currentInvoice} />
				</Container>
			</DashboardLayout>
		</>
	)
}

export default index