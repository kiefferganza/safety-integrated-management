import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import ToolboxTalkListPage from "../ToolboxTalkListPage";
import { Head } from '@inertiajs/inertia-react';

const CivilList = ({ tbt }) => {
	return (
		<>
			<Head>
				<title>Toolboxtalks: Civil</title>
			</Head>
			<DashboardLayout>
				<ToolboxTalkListPage tbt={tbt || []} type="1" />
			</DashboardLayout>
		</>
	)
}

export default CivilList