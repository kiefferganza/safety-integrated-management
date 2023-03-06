import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
const ToolboxTalkListPage = lazy(() => import("../ToolboxTalkListPage"));

const OfficeList = ({ tbt }) => {

	return (
		<>
			<Head>
				<title>Toolbox Talks: Office</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ToolboxTalkListPage tbt={tbt || []} moduleName="Office" type="5" />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default OfficeList