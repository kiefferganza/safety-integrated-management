import { lazy, Suspense } from 'react';
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
const GeneralFilePage = lazy(() => import("./GeneralFilePage"));

const index = () => {
	return (
		<>
			<Head>
				<title> General: File</title>
			</Head>
			<Suspense fallback={<LoadingScreen />}>
				<DashboardLayout>
					<GeneralFilePage />
				</DashboardLayout>
			</Suspense>
		</>
	)
}

export default index