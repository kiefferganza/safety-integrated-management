import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
// sections
const ExternalDetail = lazy(() => import("@/sections/@dashboard/training/details/external/ExternalDetail"));

const index = ({ training, type }) => {

	return (
		<>
			<Head>
				<title>External Training</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<ExternalDetail training={training} type={type} />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index