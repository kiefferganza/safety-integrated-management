import { lazy, Suspense } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const GeneralHSEDasboardPage = lazy(() => import("./GeneralHSEDasboardPage"));
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

const fetchTbt = (from, to) =>
    axiosInstance
        .get(route("api.dashboard", { from, to }))
        .then((res) => res.data);

const index = ({ auth: { user }, from, to }) => {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard", { sub: user.subscriber_id, from, to }],
        queryFn: () => fetchTbt(from, to),
        // refetchOnWindowFocus: false,
    });

    return (
        <>
            <Head>
                <title> General: HSE Analytics</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <GeneralHSEDasboardPage data={data} isLoading={isLoading} />
                </DashboardLayout>
            </Suspense>
        </>
    );
};

export default index;
