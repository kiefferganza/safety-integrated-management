import { useEffect, useState } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import InspectionListPage from "./InspectionListPage";

const index = ({ inspections, auth }) => {

	return (
		<DashboardLayout>
			<InspectionListPage inspections={inspections} user={auth?.user || {}} />
		</DashboardLayout>
	)
}

export default index