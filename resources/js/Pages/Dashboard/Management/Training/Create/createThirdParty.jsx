import { lazy, Suspense } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const TrainingEditCreatePage = lazy(() => import("../TrainingEditCreatePage"));

const index = ({ projectDetails }) => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <DashboardLayout>
                <TrainingEditCreatePage
                    title="Third Party"
                    type={3}
                    projectDetails={projectDetails}
                />
            </DashboardLayout>
        </Suspense>
    );
};

export default index;
