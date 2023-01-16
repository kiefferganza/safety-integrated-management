import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import ToolboxTalkListPage from "../ToolboxTalkListPage";
import { Head } from '@inertiajs/inertia-react';

const CivilList = ({ tbt }) => {
	return (
		<>
			<Head>
				<title>Toolboxtalks: All</title>
			</Head>
			<DashboardLayout>
				<ToolboxTalkListPage tbt={tbt || []} selectType />
			</DashboardLayout>
		</>
	)
}

export default CivilList