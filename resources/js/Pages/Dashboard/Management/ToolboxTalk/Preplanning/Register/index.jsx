import { Suspense, lazy } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import { fetchPreplanning } from "@/utils/axios";
const RegisterPage = lazy(() => import("./RegisterPage"));

const index = ({ auth: { user } }) => {
    const { isLoading, data } = useQuery({
        queryKey: ["toolboxtalks.preplanning.register", user.subscriber_id],
        queryFn: fetchPreplanning,
        refetchOnWindowFocus: false,
    });

    return (
        <>
            <Head>
                <title>Toolbox Talks Pre-planning: Register</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <RegisterPage
                        isLoading={isLoading}
                        employees={data?.employees ?? []}
                        preplanning={data?.preplanning ?? []}
                        user={user}
                    />
                </DashboardLayout>
            </Suspense>
        </>
    );
};

export default index;
