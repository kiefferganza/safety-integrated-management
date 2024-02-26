import { Suspense, lazy } from "react";
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";
import { Head } from "@inertiajs/inertia-react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
const AuthorizedPositionListPage = lazy(() =>
    import("./AuthorizedPositionListPage")
);

export default function index({ positions }) {
    return (
        <>
            <Head>
                <title>Inspections: Authorized Positions</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <AuthorizedPositionListPage positions={positions} />
                </DashboardLayout>
            </Suspense>
        </>
    );
}
