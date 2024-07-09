import { lazy, Suspense, useState } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const GeneralHSEDasboardPage = lazy(() => import("./GeneralHSEDasboardPage"));
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

const fetchTbt = ({ from, to, inspectionFrom, inspectionTo }) =>
    axiosInstance
        .get(route("api.dashboard", { from, to, inspectionFrom, inspectionTo }))
        .then((res) => res.data);

const index = ({ auth: { user }, from, to, inspectionFrom, inspectionTo }) => {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard", { sub: user.subscriber_id, from, to }],
        queryFn: () => fetchTbt({ from, to, inspectionFrom, inspectionTo }),
        refetchOnWindowFocus: false,
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
