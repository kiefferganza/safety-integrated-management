import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import InvoiceCreatePage from "./InvoiceCreatePage";

const index = () => {
	return (
		<DashboardLayout>
			<InvoiceCreatePage />
		</DashboardLayout>
	)
}

export default index