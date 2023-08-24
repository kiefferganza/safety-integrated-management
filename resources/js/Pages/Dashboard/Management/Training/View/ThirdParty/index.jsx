import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import Container from "@mui/material/Container";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { PATH_DASHBOARD } from "@/routes/paths";
// sections
const ExternalDetail = lazy(() => import("@/sections/@dashboard/training/details/external/ExternalDetail"));

const index = ({ training, type }) => {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>Third Party Training</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<Container maxWidth={themeStretch ? false : 'lg'}>
						<CustomBreadcrumbs
							heading="Course Details"
							links={[
								{ name: 'Dashboard', href: PATH_DASHBOARD.root },
								{
									name: 'Third Party List',
									href: route('training.management.external'),
								},
								{ name: training?.title || '' },
							]}
						/>
						<ExternalDetail training={training} type={type} />
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index