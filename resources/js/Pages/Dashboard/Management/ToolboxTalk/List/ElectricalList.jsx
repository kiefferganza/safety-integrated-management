import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
import { useQuery } from "@tanstack/react-query";
import { fetchTbtByType } from "@/utils/axios";
const ToolboxTalkListPage = lazy(() => import("../ToolboxTalkListPage"));

const ElectricalList = ({ auth: { user } }) => {
	const { isLoading, data: tbt } = useQuery({
		queryKey: ['toolboxtalks', { type: 2, sub: user.subscriber_id }],
		queryFn: () => fetchTbtByType(2)
	});

	return (
		<>
			<Head>
				<title>Toolbox Talks: Electrical</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ToolboxTalkListPage user={user} loading={isLoading} tbt={tbt || []} moduleName="Electrical" type="2" />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default ElectricalList