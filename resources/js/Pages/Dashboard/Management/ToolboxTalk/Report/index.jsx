import { Suspense, lazy, useEffect } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { convertTbtByYear } from "@/redux/slices/toolboxtalk";
const TBTReportPage = lazy(() => import("./TBTReportPage"));

const index = () => {
	const { isLoading, isError, data, error } = useQuery({
		queryKey: ['toolbox_talks'],
		queryFn: () => axios.get(route('api.toolbox_talks')),
		refetchOnWindowFocus: false
	});

	useEffect(() => {
		if (data?.data?.tbt) {
			convertTbtByYear({ tbt: data.data.tbt });
		}
	}, [data])

	if (isLoading || isError || error) {
		return <LoadingScreen />
	}

	return (
		<>
			<Head>
				<title>Toolbox Talks: Report</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<TBTReportPage />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index