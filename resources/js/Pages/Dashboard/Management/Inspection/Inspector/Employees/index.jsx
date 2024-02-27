import { Suspense, lazy } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { Head } from "@inertiajs/inertia-react";

const EmployeeListPage = lazy(() => import("./EmployeeListPage"));

const fetchInspections = () =>
    axiosInstance
        .get(route("api.inspections.inspectors.employees"))
        .then((res) => res.data);

const index = ({ auth: { user }, registeredPositions }) => {
    const { isLoading, data } = useQuery({
        queryKey: ["inspections", user.subscriber_id],
        queryFn: fetchInspections,
        refetchOnWindowFocus: false,
    });

    return (
        <>
            <Head>
                <title>Inspector: List</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <EmployeeListPage
                        employees={data}
                        isLoading={isLoading}
                        registeredPositions={registeredPositions}
                    />
                </DashboardLayout>
            </Suspense>
        </>
    );
};

export default index;
