import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import ToolboxTalkListPage from "../ToolboxTalkListPage";
import { Head } from '@inertiajs/inertia-react';

const CivilList = ({ tbt }) => {
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