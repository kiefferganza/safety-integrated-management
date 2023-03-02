import { useEffect } from 'react';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralAnalyticsPage from "./GeneralAnalyticsPage";
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { dispatch, useSelector } from '@/redux/store';
import { getTbts } from '@/redux/slices/toolboxtalk';

const index = ({ auth: { user }, trainings, tbtStatistics }) => {
	const { isLoading, tbtByYear, totalTbtByYear } = useSelector(state => state.toolboxtalk);

	useEffect(() => {
		if (!totalTbtByYear || !tbtByYear) {
			dispatch(getTbts());
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
				<GeneralAnalyticsPage user={user} totalTbtByYear={totalTbtByYear} trainings={trainings} tbtStatistics={tbtStatistics} />
			</DashboardLayout>
		</>
	)
}

export default index