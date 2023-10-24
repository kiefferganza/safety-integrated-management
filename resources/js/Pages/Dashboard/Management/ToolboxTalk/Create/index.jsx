import { Suspense, lazy } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
// sections
const ToolboxTalkNewEditForm = lazy(() => import("@/sections/@dashboard/toolboxtalks/form/ToolboxTalkNewEditForm"));
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";

const index = ({ projectDetails }) => {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>New Toolbox Talk</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<Container maxWidth={themeStretch ? false : 'lg'}>
						<CustomBreadcrumbs
							heading={"Create new toolbox talk"}
							links={[
								{
									name: 'Dashboard',
									href: PATH_DASHBOARD.root,
								},
								{
									name: 'Toolbox Talks',
									href: PATH_DASHBOARD.toolboxTalks.civil,
								},
								{
									name: "New Toolbox Talk"
								},
							]}
						/>
						<ToolboxTalkNewEditForm projectDetails={projectDetails} />
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index