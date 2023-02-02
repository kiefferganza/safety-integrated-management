import { useEffect } from 'react';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralAnalyticsPage from "./GeneralAnalyticsPage";
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { dispatch, useSelector } from '@/redux/store';
import { convertTbtByYear, getTbts, setToolboxTalk, startLoading } from '@/redux/slices/toolboxtalk';

const index = ({ auth: { user }, trainings, employeesCount, tbt, positions }) => {
	const { isLoading, tbtByYear, totalTbtByYear } = useSelector(state => state.toolboxtalk);

	useEffect(() => {
		if (!totalTbtByYear || !tbtByYear) {
			// dispatch(getTbts());
			dispatch(startLoading);
			dispatch(setToolboxTalk(tbt));
			convertTbtByYear({ tbt, positions });
		}
	}, [totalTbtByYear]);

	if (isLoading || !totalTbtByYear || !tbtByYear) {
		return <LoadingScreen />;
	}

	return (
		<>
			<Head>
				<title> General: Analytics</title>
			</Head>
			<DashboardLayout>
				<GeneralAnalyticsPage user={user} totalTbtByYear={totalTbtByYear} trainings={trainings} employeesCount={employeesCount} />
			</DashboardLayout>
		</>
	)
}

export default index