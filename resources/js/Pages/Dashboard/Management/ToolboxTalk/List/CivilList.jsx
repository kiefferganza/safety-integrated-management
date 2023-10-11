import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
import { fetchTbtByType } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
const ToolboxTalkListPage = lazy(() => import("../ToolboxTalkListPage"));

const CivilList = ({ auth: { user } }) => {
	const { isLoading, data: tbt } = useQuery({
		queryKey: ['toolboxtalks', { type: 1, sub: user.subscriber_id }],
		queryFn: () => fetchTbtByType(1)
	});

	return (
		<>
			<Head>
				<title>Toolbox Talks: Civil</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ToolboxTalkListPage user={user} loading={isLoading} tbt={tbt || []} type="1" />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default CivilList