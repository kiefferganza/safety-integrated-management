import { useState } from 'react';
import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import Edit from '@/sections/@dashboard/inspection/edit/Edit';
import { Box, Container, Stack, Tab, Tabs } from '@mui/material';
import { Head } from '@inertiajs/inertia-react';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import Iconify from '@/Components/iconify';
import EditDetails from '@/sections/@dashboard/inspection/edit/form/EditDetails';

const index = ({ inspection }) => {
	const { themeStretch } = useSettingsContext();
	const [currentTab, setCurrentTab] = useState('details');

	const TABS = [
		{
			value: 'details',
			label: 'Details',
			icon: <Iconify icon="heroicons:document-chart-bar" />,
			component: <EditDetails inspection={inspection} />,
		},
		{
			value: 'findings',
			label: 'Findings',
			icon: <Iconify icon="heroicons:document-magnifying-glass" />,
			component: <Edit inspection={inspection} />
		}
	];

	return (
		<DashboardLayout>
			<Head>
				<title>Unsatisfactory Items</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'lg'}>
				<CustomBreadcrumbs
					heading="Edit Item"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'List',
							href: PATH_DASHBOARD.inspection.list,
						},
						{
							name: "Detail",
							href: PATH_DASHBOARD.inspection.view(inspection.inspection_id),
						},
						{
							name: inspection?.form_number?.toUpperCase()
						},
					]}
				/>
				<Box>
					<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
						<Tabs
							value={currentTab}
							onChange={(_event, newValue) => setCurrentTab(newValue)}
							sx={{
								width: 1,
								bgcolor: 'background.paper'
							}}
						>
							{TABS.map((tab) => (
								<Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
							))}
						</Tabs>
					</Stack>
					{TABS.map((tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>)}
				</Box >
			</Container>
		</DashboardLayout>
	)
}

export default index