import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import { useSettingsContext } from "@/Components/settings";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import TrainingTrackerListPage from "./TrainingTrackerListPage";
const CustomBreadcrumbs = lazy(() =>
    import("@/Components/custom-breadcrumbs/CustomBreadcrumbs")
);
const Container = lazy(() => import("@mui/material/Container"));

const fetchTrainingTracker = () =>
    axiosInstance.get(route("api.training.tracker")).then((res) => res.data);
const index = ({ auth: { user } }) => {
    const { themeStretch } = useSettingsContext();
    const { isLoading, data } = useQuery({
        queryKey: ["training.tracker", user.subscriber_id],
        queryFn: fetchTrainingTracker,
    });

    return (
        <Suspense fallback={<LoadingScreen />}>
            <DashboardLayout>
                <Head>
                    <title>Employee Training Tracker Report</title>
                </Head>

                <Container maxWidth={themeStretch ? false : "lg"}>
                    <CustomBreadcrumbs
                        heading="Employee Training Tracker Report"
                        links={[
                            {
                                name: "Dashboard",
                                href: PATH_DASHBOARD.root,
                            },
                            {
                                name: "In House",
                                href: PATH_DASHBOARD.training.inHouse,
                            },
                            {
                                name: "Third Party",
                                href: PATH_DASHBOARD.training.thirdParty,
                            },
                            {
                                name: "Employee Training Tracker Report",
                            },
                        ]}
                    />
                    <TrainingTrackerListPage
                        employees={data?.employees ?? []}
                        loading={isLoading}
                    />
                </Container>
            </DashboardLayout>
        </Suspense>
    );
};

export default index;
