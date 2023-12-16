import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const TrainingList = lazy(() => import("./TrainingList"));
const ThirdPartyList = lazy(() => import("./ThirdPartyList"));

const index = ({ trainings, module, url, type }) => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <DashboardLayout>
                {type !== 3 ? (
                    <TrainingList
                        trainings={trainings}
                        module={module}
                        url={url}
                        type={type}
                    />
                ) : (
                    <ThirdPartyList
                        trainings={trainings}
                        url={url}
                        type={type}
                    />
                )}
            </DashboardLayout>
        </Suspense>
    );
};

export default index;
