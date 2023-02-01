import { useEffect, useState } from 'react';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralAnalyticsPage from "./GeneralAnalyticsPage";
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { dispatch, useSelector } from '@/redux/store';
import { convertTbtByYear, getTbts, setToolboxTalk, startLoading } from '@/redux/slices/toolboxtalk';

const index = ({ auth: { user }, data, tbt, positions, employeesCount }) => {
	const { isLoading, tbtByYear, totalTbtByYear } = useSelector(state => state.toolboxtalk);

	useEffect(() => {
		if (!totalTbtByYear || !tbtByYear) {
			dispatch(startLoading);
			convertTbtByYear({ tbt, positions });
			dispatch(setToolboxTalk(tbt));
			// dispatch(getTbts());
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
				<GeneralAnalyticsPage user={user} data={data} totalTbtByYear={totalTbtByYear} tbtByYear={tbtByYear} employeesCount={employeesCount} />
			</DashboardLayout>
		</>
	)
}

export default index