import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const TrainingInHouseList = lazy(() => import("./TrainingInHouseList"));

export default function index({ trainings }) {
    return (
        <>
            <Head>
                <title>In House Training</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <TrainingInHouseList trainings={trainings} />
                </DashboardLayout>
            </Suspense>
        </>
    );
}
