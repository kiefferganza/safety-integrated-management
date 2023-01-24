import { useEffect, useState } from 'react';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralAnalyticsPage from "./GeneralAnalyticsPage";
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { dispatch, useSelector } from '@/redux/store';
import { getTbts } from '@/redux/slices/toolboxtalk';

const index = ({ auth: { user }, data }) => {
	const { isLoading, totalTbtByYear } = useSelector(state => state.toolboxtalk);
	const [items, setItems] = useState({
		totalMainContractors: 0,
		totalSubContractors: 0,
		itds: {
			count: 0,
			itdMonth: 0,
			totalHoursByMonth: 0,
			totalItd: 0,
			totalParticipantsPerMonth: 0,
			totalDays: 0,
			itdsManual: 0
		},
		trainingHours: {
			thisMonth: 0,
			itd: 0
		},
		tbt: {
			thisMonth: 0,
			itd: 0
		},
	});

	useEffect(() => {
		setItems({
			totalMainContractors: data.contractors?.total_main_contractors || 0,
			totalSubContractors: data.contractors?.total_sub_contractors || 0,
			itds: {
				count: data.itds_data?.count || 0,
				itdMonth: data?.itds_data?.itd_month || 0,
				totalHoursByMonth: parseInt(data.itds_data?.total_hours_selected_month || 0),
				totalItd: parseInt(data.itds_data?.total_itd || 0),
				totalParticipantsPerMonth: data.itds_data?.total_participants_per_month || 0,
				totalDays: data.itds_data?.totals_days || 0,
				itdsManual: parseInt(data?.itds_manual?.total_itds || 0),
			},
			trainingHours: {
				thisMonth: parseInt(data.training_hours?.this_month?.total_hours || 0),
				itd: parseInt(data.training_hours?.itd?.total_training_itd || 0),
			},
			tbt: {
				thisMonth: data.tbt?.this_month?.total_tbt || 0,
				itd: data.tbt?.itd?.total_tbt || 0
			},
		});
	}, [data]);

	useEffect(() => {
		if (totalTbtByYear === null) {
			dispatch(getTbts());
		}
	}, [totalTbtByYear]);

	if (isLoading || totalTbtByYear === null) {
		return <LoadingScreen />;
	}

	return (
		<>
			<Head>
				<title> General: Analytics</title>
			</Head>
			<DashboardLayout>
				<GeneralAnalyticsPage user={user} items={items} data={data} totalTbtByYear={totalTbtByYear} />
			</DashboardLayout>
		</>
	)
}

export default index