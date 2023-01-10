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
import ToolboxTalkNewEditForm from "@/sections/@dashboard/toolboxtalks/form/ToolboxTalkNewEditForm";

const index = () => {
	const { themeStretch } = useSettingsContext();

	return (
		<>
			<Head>
				<title>New ToolboxTalk</title>
			</Head>
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
					<ToolboxTalkNewEditForm type="1" />
				</Container>
			</DashboardLayout>
		</>
	)
}

export default index