import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import { Head } from "@inertiajs/inertia-react";
import { useSettingsContext } from "@/Components/settings";
import { PATH_DASHBOARD } from "@/routes/paths";
import CustomBreadcrumbs from "@/Components/custom-breadcrumbs/CustomBreadcrumbs";
import PpeReportDetailToolbar from "@/sections/@dashboard/ppe/details/PpeReportDetailToolbar";
import ReportDetailHead from "@/sections/@dashboard/ppe/details/ReportDetailHead";
const ReportDetailPage = lazy(() => import("./ReportDetailPage"));

const index = ({ report }) => {
	const { themeStretch } = useSettingsContext();
	console.log(report)
	return (
		<>
			<Head>
				<title> PPE: Report Detail</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<Container maxWidth={themeStretch ? false : 'lg'}>
						<CustomBreadcrumbs
							heading={report?.form_number?.toUpperCase()}
							links={[
								{
									name: 'PPE',
									href: PATH_DASHBOARD.ppe.root,
								},
								{
									name: "Report",
									href: PATH_DASHBOARD.ppe.report,
								},
								{
									name: "Report List",
									href: PATH_DASHBOARD.ppe.reportList,
								},
								{
									name: report?.form_number?.toUpperCase()
								},
							]}
						/>
						<PpeReportDetailToolbar inventoryReport={report} />
						<Card sx={{ p: 3 }}>
							<ReportDetailHead inventoryReport={report} title="Monthly HSE Inventory Report & Budget Forecast" />
							<ReportDetailPage inventoryReport={report} />
						</Card>
					</Container>
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index