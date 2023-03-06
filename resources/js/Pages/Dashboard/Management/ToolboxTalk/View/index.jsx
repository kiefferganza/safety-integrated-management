import { Suspense, lazy } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
import { capitalCase } from "change-case";
import { formatCms } from "@/utils/tablesUtils";
// @mui
const Container = lazy(() => import('@mui/material/Container'));
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
// sections
const ToolboxTalkDetail = lazy(() => import("@/sections/@dashboard/toolboxtalks/details/ToolboxTalkDetail"));
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
const TYPE_OPTIONS = {
	"1": 'civil',
	"2": 'electrical',
	"3": 'mechanical',
	"4": 'camp',
	"5": 'office',
};

const index = ({ tbt }) => {
	const { themeStretch } = useSettingsContext();

	const cms = formatCms(tbt);

	return (
		<>
			<Head>
				<title>{cms}</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<Container maxWidth={themeStretch ? false : 'lg'}>
						<CustomBreadcrumbs
							heading={cms.toUpperCase()}
							links={[
								{
									name: 'Dashboard',
									href: PATH_DASHBOARD.root,
								},
								{
									name: capitalCase(TYPE_OPTIONS[tbt.tbt_type]),
									href: PATH_DASHBOARD.toolboxTalks[TYPE_OPTIONS[tbt.tbt_type]],
								},
								{
									name: cms.toUpperCase()
								},
							]}
						/>
						<ToolboxTalkDetail tbt={tbt} />
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index