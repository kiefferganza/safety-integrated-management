import { useEffect } from 'react';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralAnalyticsPage from "./GeneralAnalyticsPage";
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { dispatch, useSelector } from '@/redux/store';
import { getTbts } from '@/redux/slices/toolboxtalk';

const index = ({ auth: { user }, employeesCount, trainings }) => {
	const { isLoading, totalTbtByYear } = useSelector(state => state.toolboxtalk);

	useEffect(() => {
		if (!totalTbtByYear) {
			dispatch(getTbts());
		}
	}, [totalTbtByYear]);

	if (isLoading || !totalTbtByYear) {
		return <LoadingScreen />;
	}

	return (
		<>
			<Head>
				<title> General: Analytics</title>
			</Head>
			<DashboardLayout>
				<GeneralAnalyticsPage user={user} totalTbtByYear={totalTbtByYear} employeesCount={employeesCount} trainings={trainings} />
			</DashboardLayout>
		</>
	)
}

export default index