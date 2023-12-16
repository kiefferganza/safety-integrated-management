import { lazy, Suspense } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const EditCreatePage = lazy(() => import("./EditCreatePage"));

const index = ({ projectDetails }) => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <DashboardLayout>
                <EditCreatePage projectDetails={projectDetails} />
            </DashboardLayout>
        </Suspense>
    );
};

export default index;
