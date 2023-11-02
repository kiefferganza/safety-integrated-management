import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useSettingsContext } from "@/Components/settings";
import Container from "@mui/material/Container";
import IncidentDetailToolbar from "@/sections/@dashboard/incident/detail/IncidentDetailToolbar";
const IncidentDetailPage = lazy(() => import("./IncidentDetailPage"));

const index = ({ incident }) => {
	const { themeStretch } = useSettingsContext();
	return (
		<>
			<Head>
				<title>Incident</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<Container maxWidth={themeStretch ? false : 'lg'}>
						<CustomBreadcrumbs
							heading="Incident Details"
							links={[
								{ name: 'Dashboard', href: PATH_DASHBOARD.root },
								{
									name: 'List',
									href: PATH_DASHBOARD.incident.root,
								},
								{ name: incident.form_number },
							]}
						/>
						<IncidentDetailToolbar incident={incident} />
						<IncidentDetailPage incident={incident} />
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index