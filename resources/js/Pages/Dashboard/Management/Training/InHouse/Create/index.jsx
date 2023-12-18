import { lazy, Suspense } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const EditCreatePage = lazy(() => import("./EditCreatePage"));

const index = ({ projectDetails, currentTraining }) => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <DashboardLayout>
                <EditCreatePage
                    projectDetails={projectDetails}
                    currentTraining={currentTraining}
                    isEdit={!!currentTraining}
                />
            </DashboardLayout>
        </Suspense>
    );
};

export default index;
