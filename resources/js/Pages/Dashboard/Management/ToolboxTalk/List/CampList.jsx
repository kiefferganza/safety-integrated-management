import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import ToolboxTalkListPage from "../ToolboxTalkListPage";
import { Head } from '@inertiajs/inertia-react';

const CivilList = ({ tbt }) => {
	return (
		<>
			<Head>
				<title>Toolbox Talks: Camp</title>
			</Head>
			<DashboardLayout>
				<ToolboxTalkListPage tbt={tbt || []} moduleName="Camp" type="4" />
			</DashboardLayout>
		</>
	)
}

export default CivilList