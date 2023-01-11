import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
import { capitalCase } from "change-case";
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
// sections
import ToolboxTalkNewEditForm from "@/sections/@dashboard/toolboxtalks/form/ToolboxTalkNewEditForm";
import { formatCms } from "@/utils/tablesUtils";
import Label from "@/Components/label";

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

	console.log(tbt);

	return (
		<>
			<Head>
				<title>Toolbox Talk: Update</title>
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
					<ToolboxTalkNewEditForm isEdit tbt={tbt} />
				</Container>
			</DashboardLayout>
		</>
	)
}

export default index