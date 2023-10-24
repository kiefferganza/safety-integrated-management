import { Suspense, useEffect, lazy } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
import { useDispatch } from '@/redux/store';
import { convertTbtByYear, setToolboxTalk } from "@/redux/slices/toolboxtalk";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
const ToolboxTalkListPage = lazy(() => import("../ToolboxTalkListPage"));

const fetchTbt = () => axiosInstance.get(route('api.tbt.index')).then(res => res.data);

const CivilList = ({ auth: { user }, positions }) => {
	const { isLoading, data } = useQuery({
		queryKey: ['toolboxtalks', user.subscriber_id],
		queryFn: fetchTbt,
		refetchOnWindowFocus: false
	});
	const dispatch = useDispatch();

	useEffect(() => {
		if (data) {
			dispatch(setToolboxTalk(data));
			convertTbtByYear({ data, positions });
		}
	}, [isLoading, data]);

	return (
		<>
			<Head>
				<title>Toolbox Talks: All</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ToolboxTalkListPage user={user} loading={isLoading} tbt={data} selectType addTypeHeader moduleName="All" />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default CivilList