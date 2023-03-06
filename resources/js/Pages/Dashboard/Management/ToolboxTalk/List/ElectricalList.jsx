import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
const ToolboxTalkListPage = lazy(() => import("../ToolboxTalkListPage"));

const ElectricalList = ({ tbt }) => {
	return (
		<>
			<Head>
				<title>Toolbox Talks: Electrical</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ToolboxTalkListPage tbt={tbt || []} moduleName="Electrical" type="2" />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default ElectricalList