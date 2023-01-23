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
import { formatCms } from "@/utils/tablesUtils";
import ToolboxTalkDetail from "@/sections/@dashboard/toolboxtalks/details/ToolboxTalkDetail";
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
		</>
	)
}

export default index