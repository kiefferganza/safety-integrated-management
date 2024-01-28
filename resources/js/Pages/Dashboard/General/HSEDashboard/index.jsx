import { lazy, Suspense } from "react";
import DashboardLayout from "@/Layouts/dashboard/DashboardLayout";
import { Head } from "@inertiajs/inertia-react";
const GeneralHSEDasboardPage = lazy(() => import("./GeneralHSEDasboardPage"));
import LoadingScreen from "@/Components/loading-screen/LoadingScreen";

const index = () => {

    return (
        <>
            <Head>
                <title> General: HSE Analytics</title>
            </Head>
            <Suspense fallback={<LoadingScreen />}>
                <DashboardLayout>
                    <GeneralHSEDasboardPage />
                </DashboardLayout>
            </Suspense>
        </>
    );
};

export default index;
