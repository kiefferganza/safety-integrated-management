import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { PATH_DASHBOARD } from "@/routes/paths";
import InspectionNewForm from "@/sections/@dashboard/inspection/form/InspectionNewForm";
import { Head } from "@inertiajs/inertia-react";
import { Container } from "@mui/material";

const index = () => {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>Inspection Form</title>
			</Head>
			<DashboardLayout>
				<Container maxWidth={themeStretch ? false : 'lg'}>
					<CustomBreadcrumbs
						heading={"Inspection Form"}
						links={[
							{
								name: 'Dashboard',
								href: PATH_DASHBOARD.root,
							},
							{
								name: 'Inpections',
								href: PATH_DASHBOARD.inspection.list,
							},
							{
								name: "New Inspection",
							},
						]}
					/>

					<InspectionNewForm />
				</Container>
			</DashboardLayout>
		</>
	)
}

export default index