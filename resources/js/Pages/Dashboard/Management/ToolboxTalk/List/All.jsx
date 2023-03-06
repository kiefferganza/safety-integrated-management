import { Suspense, useEffect, lazy } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from '@inertiajs/inertia-react';
import { useDispatch } from '@/redux/store';
import { convertTbtByYear, setToolboxTalk } from "@/redux/slices/toolboxtalk";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
const ToolboxTalkListPage = lazy(() => import("../ToolboxTalkListPage"));

const CivilList = ({ tbt, positions }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setToolboxTalk(tbt));
		convertTbtByYear({ tbt, positions });
	}, []);

	return (
		<>
			<Head>
				<title>Toolbox Talks: All</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ToolboxTalkListPage tbt={tbt || []} selectType addTypeHeader moduleName="All" />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default CivilList