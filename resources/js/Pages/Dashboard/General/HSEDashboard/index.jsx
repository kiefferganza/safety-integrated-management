import { lazy, Suspense, useEffect, useState } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const GeneralHSEDasboardPage = lazy(() => import("./GeneralHSEDasboardPage"));
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import axiosInstance from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

const fetchTbt = (from, to) =>
    axiosInstance
        .get(route("api.dashboard.toolboxtalks", { from, to }))
        .then((res) => res.data);

const index = ({
    auth: { user },
    inspections,
    trainings,
    incidents,
    from,
    to,
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const {
        isLoading: isLoadingTbt,
        isError: isErrorTbt,
        data: tbt,
    } = useQuery({
        queryKey: ["dash-toolboxtalks", { sub: user.subscriber_id, from, to }],
        queryFn: () => fetchTbt(from, to),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isErrorTbt) {
            enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
    }, [isErrorTbt]);

    return (
        <>
            <Head>
                <title> General: HSE Analytics</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <GeneralHSEDasboardPage
                        isLoadingTbt={isLoadingTbt}
                        user={user}
                        tbt={tbt}
                        trainings={trainings}
                        inspections={inspections}
                        incidents={incidents}
                        from={from}
                        to={to}
                    />
                </DashboardLayout>
            </Suspense>
        </>
    );
};

export default index;
