import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import ToolboxTalkListPage from "../ToolboxTalkListPage";
import { Head } from '@inertiajs/inertia-react';

const MechanicalList = ({ tbt }) => {
	return (
		<>
			<Head>
				<title>Toolboxtalks: Mechanical</title>
			</Head>
			<DashboardLayout>
				<ToolboxTalkListPage tbt={tbt || []} moduleName="Mechanical" type="3" />
			</DashboardLayout>
		</>
	)
}

export default MechanicalList