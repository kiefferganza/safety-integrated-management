import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
const ToolboxTalkListPage = lazy(() => import("../ToolboxTalkListPage"));

const CivilList = ({ tbt }) => {
	return (
		<>
			<Head>
				<title>Toolbox Talks: Camp</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ToolboxTalkListPage tbt={tbt || []} moduleName="Camp" type="4" />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default CivilList