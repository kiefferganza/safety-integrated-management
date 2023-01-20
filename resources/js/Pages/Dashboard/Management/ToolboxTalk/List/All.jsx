import { useEffect } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import ToolboxTalkListPage from "../ToolboxTalkListPage";
import { Head } from '@inertiajs/inertia-react';
import { useDispatch } from '@/redux/store';
import { convertTbtByYear, setToolboxTalk } from "@/redux/slices/toolboxtalk";

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
			<DashboardLayout>
				<ToolboxTalkListPage tbt={tbt || []} selectType addTypeHeader moduleName="All" />
			</DashboardLayout>
		</>
	)
}

export default CivilList