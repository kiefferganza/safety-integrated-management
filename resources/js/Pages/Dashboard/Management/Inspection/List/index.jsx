import { Suspense, lazy } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

const InspectionListPage = lazy(() => import("./InspectionListPage"));

const fetchInspections = () =>
    axiosInstance.get(route("api.inspections.index")).then((res) => res.data);

const index = ({ auth: { user } }) => {
    const { isLoading, data } = useQuery({
        queryKey: ["inspections", user.subscriber_id],
        queryFn: fetchInspections,
        refetchOnWindowFocus: false,
    });

    return (
        <Suspense fallback={<LoadingScreen />}>
            <DashboardLayout>
                <InspectionListPage
                    inspections={data}
                    user={user || {}}
                    isLoading={isLoading}
                />
            </DashboardLayout>
        </Suspense>
    );
};

export default index;
