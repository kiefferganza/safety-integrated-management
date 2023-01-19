import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import ToolboxTalkListPage from "../ToolboxTalkListPage";
import { Head } from '@inertiajs/inertia-react';

const OfficeList = ({ tbt }) => {
	return (
		<>
			<Head>
				<title>Toolbox Talks: Office</title>
			</Head>
			<DashboardLayout>
				<ToolboxTalkListPage tbt={tbt || []} moduleName="Office" type="5" />
			</DashboardLayout>
		</>
	)
}

export default OfficeList