import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import GeneralEcommercePage from "./GeneralEcommercePage";

const index = ({ auth }) => {
	return (
		<>
			<Head>
				<title>General: E-commerce</title>
			</Head>
			<DashboardLayout>
				<GeneralEcommercePage user={auth?.user || {}} />
			</DashboardLayout>
		</>
	)
}

export default index