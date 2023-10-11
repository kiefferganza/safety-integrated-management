import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
import { useQuery } from "@tanstack/react-query";
import { fetchTbtByType } from "@/utils/axios";
const ToolboxTalkListPage = lazy(() => import("../ToolboxTalkListPage"));

const MechanicalList = ({ auth: { user } }) => {
	const { isLoading, data: tbt } = useQuery({
		queryKey: ['toolboxtalks', { type: 3, sub: user.subscriber_id }],
		queryFn: () => fetchTbtByType(3)
	});

	return (
		<>
			<Head>
				<title>Toolbox Talks: Mechanical</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ToolboxTalkListPage user={user} loading={isLoading} tbt={tbt || []} moduleName="Mechanical" type="3" />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default MechanicalList