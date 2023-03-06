import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
const ToolboxTalkListPage = lazy(() => import("../ToolboxTalkListPage"));

const CivilList = ({ tbt }) => {
	return (
		<>
			<Head>
				<title>Toolbox Talks: Civil</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ToolboxTalkListPage tbt={tbt || []} type="1" />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default CivilList