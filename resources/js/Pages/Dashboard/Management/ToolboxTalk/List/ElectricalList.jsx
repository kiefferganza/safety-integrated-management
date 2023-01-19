import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import ToolboxTalkListPage from "../ToolboxTalkListPage";
import { Head } from '@inertiajs/inertia-react';

const ElectricalList = ({ tbt }) => {
	return (
		<>
			<Head>
				<title>Toolbox Talks: Electrical</title>
			</Head>
			<DashboardLayout>
				<ToolboxTalkListPage tbt={tbt || []} moduleName="Electrical" type="2" />
			</DashboardLayout>
		</>
	)
}

export default ElectricalList