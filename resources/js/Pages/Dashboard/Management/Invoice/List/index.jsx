import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import InvoiceListPage from "./InvoiceListPage";

const index = () => {
	return (
		<DashboardLayout>
			<InvoiceListPage />
		</DashboardLayout>
	)
}

export default index