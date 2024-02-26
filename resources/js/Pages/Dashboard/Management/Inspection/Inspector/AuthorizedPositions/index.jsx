import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { Head } from "@inertiajs/inertia-react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchPositions } from "@/utils/axios";

const AuthorizedPositionListPage = lazy(() =>
    import("./AuthorizedPositionListPage")
);

export default function index({ positions, auth: { user } }) {
    const { isLoading, data } = useQuery({
        queryKey: ["inspections", user.subscriber_id],
        queryFn: fetchPositions,
        refetchOnWindowFocus: false,
    });

    return (
        <>
            <Head>
                <title>Inspections: Authorized Positions</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <AuthorizedPositionListPage
                        authorizedPositions={positions}
                        isLoading={isLoading}
                        positionList={data}
                    />
                </DashboardLayout>
            </Suspense>
        </>
    );
}
