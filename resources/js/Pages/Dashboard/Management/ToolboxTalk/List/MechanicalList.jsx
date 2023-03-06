import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
const ToolboxTalkListPage = lazy(() => import("../ToolboxTalkListPage"));

const MechanicalList = ({ tbt }) => {
	return (
		<>
			<Head>
				<title>Toolbox Talks: Mechanical</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ToolboxTalkListPage tbt={tbt || []} moduleName="Mechanical" type="3" />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default MechanicalList