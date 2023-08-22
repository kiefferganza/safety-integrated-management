import { Suspense, lazy } from 'react';
import DashboardLayout from '@/Layouts/dashboard/DashboardLayout';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { Container } from '@mui/material';
import { Head } from '@inertiajs/inertia-react';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import Label from '@/Components/label';
const InspectionDetailPage = lazy(() => import('./InspectionDetailPage'));

const index = ({ inspection, rolloutDate }) => {
	const { themeStretch } = useSettingsContext();

	const getInspectionStatus = (status) => {
		let result = {
			code: status,
			classType: 'default',
			text: '',
			tooltip: '',
		};
		switch (status) {
			case 1:
			case 0:
				result.classType = 'warning';
				result.text = 'I P';
				result.tooltip = 'In Progress';
				break;
			case 2:
				result.classType = 'error';
				result.text = 'W F C';
				result.tooltip = 'Waiting For Closure';
				break;
			case 3:
				result.classType = 'success';
				result.text = 'C';
				result.tooltip = 'Closed';
				break;
			default:
				result.classType = 'error';
				result.text = 'F R'
				result.tooltip = 'For Revision'
		}
		return result;
	}

	const inspectionStatus = getInspectionStatus(inspection.status);

	return (
		<>
			<Head>
				<title>Inspection - Details</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<Container maxWidth={themeStretch ? false : 'lg'}>
						<CustomBreadcrumbs
							heading={inspection?.form_number?.toUpperCase()}
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
									name: inspection?.form_number?.toUpperCase(),
								},
							]}
							action={
								<Label
									variant="soft"
									color={inspectionStatus.classType}
								>
									{inspectionStatus.tooltip}
								</Label>
							}
						/>

						<InspectionDetailPage inspection={inspection} rolloutDate={rolloutDate} />
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index