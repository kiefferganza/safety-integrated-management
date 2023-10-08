import { Suspense, lazy } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
import { capitalCase } from "change-case";
import { formatCms } from "@/utils/tablesUtils";
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
import Label from "@/Components/label";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
// sections
const ToolboxTalkNewEditForm = lazy(() => import("@/sections/@dashboard/toolboxtalks/form/ToolboxTalkNewEditForm"));

const TYPE_OPTIONS = {
	"1": 'civil',
	"2": 'electrical',
	"3": 'mechanical',
	"4": 'camp',
	"5": 'office',
};

const index = ({ tbt, projectDetails }) => {
	const { themeStretch } = useSettingsContext();

	const cms = formatCms(tbt);

	return (
		<>
			<Head>
				<title>Toolbox Talk: Update</title>
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
									name: capitalCase(TYPE_OPTIONS[tbt.tbt_type]),
									href: PATH_DASHBOARD.toolboxTalks[TYPE_OPTIONS[tbt.tbt_type]],
								},
								{
									name: cms.toUpperCase()
								},
							]}
							action={
								<Label
									variant="soft"
									color={tbt?.status === "1" ? "success" : "warning"}
								>
									{tbt?.status === "1" ? "Completed" : "Incomplete"}
								</Label>
							}
						/>
						<ToolboxTalkNewEditForm isEdit tbt={tbt} projectDetails={projectDetails} />
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index