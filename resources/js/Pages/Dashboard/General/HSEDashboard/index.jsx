import { lazy, Suspense, useEffect, useState } from 'react';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const GeneralHSEDasboardPage = lazy(() => import("./GeneralHSEDasboardPage"));
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { convertTbtByYear } from '@/utils/convertTBt';
import axiosInstance from '@/utils/axios';
import { useQueries } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

const fetchTbt = (from, to) => axiosInstance.get(route('api.dashboard.toolboxtalks', { from, to })).then(res => res.data);
const fetchTbtStatistics = (from, to) => axiosInstance.get(route('api.dashboard.tbt_statistics', { from, to })).then(res => res.data);

const index = ({ auth: { user }, inspections, trainings, incidents, from, to }) => {
	const { enqueueSnackbar } = useSnackbar();
	const [totalTbtByYear, setTotalTbtByYear] = useState(null);
	const [
		{ isLoading: isLoadingTbt, isError: isErrorTbt, data: toolboxtalks },
		{ isLoading: isLoadingTbtStat, isError: isErrorTbtStat, data: tbtStatistics },
	] = useQueries({
		queries: [
			{ queryKey: ['dash-toolboxtalks', { sub: user.subscriber_id, from, to }], queryFn: () => fetchTbt(from, to), refetchOnWindowFocus: false },
			{ queryKey: ['dash-tbtStatistics', { sub: user.subscriber_id, from, to }], queryFn: () => fetchTbtStatistics(from, to), refetchOnWindowFocus: false },
		]
	});

	useEffect(() => {
		if (toolboxtalks && tbtStatistics) {
			const convertedTbt = convertTbtByYear({ tbt: toolboxtalks })
			setTotalTbtByYear(convertedTbt.totalTbtByYear);
		}
		if (isErrorTbtStat || isErrorTbt) {
			enqueueSnackbar('Something went wrong!', { variant: "error" });
		}
	}, [from, to, toolboxtalks, tbtStatistics, isErrorTbtStat, isErrorTbt, isLoadingTbt, isLoadingTbtStat]);

	return (
		<>
			<Head>
				<title> General: Analytics</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<GeneralHSEDasboardPage
						isLoadingTbt={isLoadingTbt}
						isLoadingTbtStat={isLoadingTbtStat}
						user={user}
						totalTbtByYear={totalTbtByYear}
						trainings={trainings}
						tbtStatistics={tbtStatistics}
						inspections={inspections}
						incidents={incidents}
						from={from}
						to={to}
					/>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index