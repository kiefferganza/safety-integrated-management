import { Suspense, lazy } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const CompanyListPage = lazy(() => import("./CompanyListPage"));
import LoadingScreen from "@/Components/loading-screen";

const index = ({ companies }) => {

	return (
		<>
			<Head>
				<title>Companies</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<CompanyListPage companies={companies} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index